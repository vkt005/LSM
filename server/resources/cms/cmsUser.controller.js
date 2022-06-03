"use strict";
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const BaseController = require("../../lib/base.controller");
const Jwt = require("../../lib/jwt");
const CmsUser = mongoose.model("CmsUser");
const SchemaCommon = new mongoose.Schema({}, { strict: false });
const Permission = mongoose.model("permission", SchemaCommon);

module.exports = class CmsUserController extends BaseController {
  constructor(apiRouter, basePath) {
    super(apiRouter, basePath);
    this.registerRoutes();
  }
  registerRoutes() {
    this.router.post(
      `${this.basePath}/login`,
      this.handleAsyncErrors(this.login)
    );
    this.router.get(`${this.basePath}`, this.handleAsyncErrors(this.getUsers));
    this.router.get(
      `${this.basePath}/userList/:id`,
      this.handleAsyncErrors(this.getUsersList)
    );
    this.router.get(
      `${this.basePath}/:id`,
      this.handleAsyncErrors(this.getUser)
    );
    this.router.post(
      `${this.basePath}/pwd`,
      this.handleAsyncErrors(this.changePassword)
    );
    this.router.post(`${this.basePath}`, this.handleAsyncErrors(this.saveUser));
  }

  async login(req, res) {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .send({ msg: "Please provide email id and password" });

    const userRecord = await CmsUser.findOne(
      { status: true, email },
      "+password"
    );

    if (!userRecord)
      return res.status(400).send({ msg: "Invalid email id or password!" });

    bcrypt.compare(
      password,
      userRecord.password,
      async function (err, isMatch) {
        if (!isMatch)
          return res.status(400).send({ msg: "Password doesn't match." });
        else {
          const f = userRecord.toObject();
          const authToken = Jwt.issueToken({ _id: f._id, email: f.email });

          const permission = await Permission.findOne({ role: f.userRole });

          delete f.deletedAt;
          delete f.createdAt;
          delete f.updatedAt;
          delete f.otp;
          delete f.password;

          return res.send({ ...f, token: authToken.token, permission });
        }
      }
    );
  }

  async getUsers(req, res) {
    const { delegate } = req.query;
    let users;

    if (delegate)
      users = await CmsUser.find(
        {},
        { firstName: 1, lastName: 1, userRole: 1 }
      );
    else users = await CmsUser.find();

    return res.send(users);
  }

  async getUsersList(req, res) {
    const id = req.params.id;

    // if (user.userRole === "Super Admin") {
    //   const users = await CmsUser.find();
    //   return res.send(users);
    // }

    let match = {
      email: id,
    };
    const me = await CmsUser.findOne({ email: id })
      .select("visibilityType userRole")
      .lean();
    if (me && me.visibilityType == "sameGroup") {
      match = {
        userRole: me.userRole,
      };
    }

    const list = await CmsUser.aggregate([
      {
        $match: match,
      },
      {
        $graphLookup: {
          from: "cmsusers",
          startWith: "$_id",
          connectFromField: "_id",
          connectToField: "parentId",
          as: "Childs",
        },
      },
      { $project: { Childs: 1 } },
      { $unwind: "$Childs" },
      {
        $project: {
          _id: "$Childs._id",
          email: "$Childs.email",
          firstName: "$Childs.firstName",
          lastName: "$Childs.lastName",
          contactNumber: "$Childs.contactNumber",
          updatedAt: "$Childs.updatedAt",
          userRole: "$Childs.userRole",
          status: "$Childs.status",
          companyName: "$Childs.companyName",
        },
      },
      { $sort: { firstName: 1 } },
    ]);

    return res.send(list);
  }

  async getUser(req, res) {
    const id = req.params.id;
    const user = await CmsUser.findOne({ _id: id });

    return res.send(user);
  }

  async saveUser(req, res) {
    const data = req.body;

    if (data.password) data.password = await this.hashPassword(data.password);

    if (!data._id) {
      let output = new CmsUser(data);
      try {
        await output.save();
      } catch (err) {
        console.log(err);
        if (err.code == 11000) {
          // duplicate lead alert
          return res.status(400).send({ msg: "Duplicate User" });
        }
      }

      return res.send(output);
    } else {
      const output = await CmsUser.findOneAndUpdate({ _id: data._id }, data, {
        new: true,
      });

      return res.send(output);
    }
  }

  async changePassword(req, res) {
    const { current, newPwd } = req.body;
    const { email } = req.user;
    const userRecord = await CmsUser.findOne(
      { status: true, email },
      "+password"
    );
    const password = await this.hashPassword(newPwd);

    bcrypt.compare(current, userRecord.password, async function (err, isMatch) {
      if (!isMatch) return res.status(400).send({ msg: "Wrong Password" });

      await CmsUser.findOneAndUpdate({ email }, { password });

      return res.send("success");
    });
  }

  async hashPassword(password) {
    const SALT_WORK_FACTOR = 10;

    try {
      let salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
      let hashedPassword = await bcrypt.hash(password, salt);

      return hashedPassword;
    } catch (err) {
      throw err;
    }
  }
};
