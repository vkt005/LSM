/* eslint-disable no-inner-declarations */
'use strict';
const mongoose = require('mongoose');
const moment = require('moment');
const fetch = require("node-fetch");
const generator = require('generate-password');
const aws = require('aws-sdk');
const bcrypt = require('bcryptjs');

const BaseController = require('../lib/base.controller');
const Config = require('../../config/');
const { sendMailToUser } = require('../lib/utils');
const otpEmail = require('./otp');
const utils = require('../lib/utils');
const CmsUser = mongoose.model('CmsUser');
const SchemaCommon = new mongoose.Schema({}, { strict: false });
const BUCKET_NAME = Config.AWSS3.BUCKET_NAME;
const Leads = mongoose.model('Lead');
const Bdms = mongoose.model('bdm', SchemaCommon);
const Consultant = mongoose.model('consultant', SchemaCommon);
const LeadOld = mongoose.model('leadOld', SchemaCommon, 'leadOld');
const Vas = mongoose.model('vasmarketings', SchemaCommon);

aws.config.update({
  region: Config.AWSS3.REGION, // Put your aws region here
  accessKeyId: Config.AWSS3.ACCESS_KEY,
  secretAccessKey: Config.AWSS3.SECRET_KEY,
});


class MixController extends BaseController {
  constructor(apiRouter, basePath) {
    super(apiRouter, basePath);
    this.registerRoutes();
  }
  registerRoutes() {
    this.router.post(
      `${this.basePath}/upload`,
      this.handleAsyncErrors(this.upload)
    );
    this.router.post(
      `${this.basePath}/forgot`,
      this.handleAsyncErrors(this.resetPassword)
    );
    this.router.post(
      `${this.basePath}/otp`,
      this.handleAsyncErrors(this.checkOTP)
    );
    this.router.post(
      `${this.basePath}/pwd`,
      this.handleAsyncErrors(this.changePassword)
    );
    this.router.get(
      `${this.basePath}/test`,
      this.handleAsyncErrors(this.test)
    );
    /*  this.router.get(
      `${this.basePath}/userMigration`,
      this.handleAsyncErrors(this.userMigration)
    ); */
    this.router.post(
      `${this.basePath}/update_owner`,
      this.handleAsyncErrors(this.update_owner)
    );
    this.router.post(
      `${this.basePath}/status`,
      this.handleAsyncErrors(this.syncCrmLeadsStatus)
    );
    this.router.get(
      `${this.basePath}/resendPasswordToUser/:id`,
      this.handleAsyncErrors(this.resendPasswordToUser)
    );
    this.router.get(
      `${this.basePath}/get_lead_via_crm_id/:id`,
      this.handleAsyncErrors(this.getLeadViaCrmID)
    );
    this.router.post(
      `${this.basePath}/fromUl`,
      this.handleAsyncErrors(this.createLeadFromUl)
    );
    this.router.get(
      `${this.basePath}/checkLeadStatus/:orderId`,
      this.handleAsyncErrors(this.checkLeadStatus)
    );
    this.router.get(
      `${this.basePath}/brand/:desiredURL`,
      this.handleAsyncErrors(this.brand)
    );
    /* this.router.get(
      `${this.basePath}/leadMigration`,
      this.handleAsyncErrors(this.leadMigration)
    ); */
  }

  async test(req, res) {
    /* const data = await Leads.find({"createdBy.companyName":{$exists:false},createdBy:{$type:"object"}}).select("createdBy").lean();
    for(let item of data){
      const user = await CmsUser.findById(item.createdBy.id).select('companyName').lean();
      console.log(user,item);
      if(user){

        await Leads.findByIdAndUpdate(item._id,{$set:{"createdBy.companyName":user.companyName}}).catch(console.error);
      }
    } */

    /* const data = await Leads.find({"leadOwnerCompanyName":{$exists:false},leadOwnerId:{$exists:true}}).select("createdBy leadOwnerId").lean();
    for(let item of data){
      const user = await CmsUser.findById(item.leadOwnerId).select('companyName').lean();
      console.log(user,item);
      if(user){

        await Leads.findByIdAndUpdate(item._id,{$set:{"leadOwnerCompanyName":user.companyName}}).catch(console.error);
      }
    }  */





    return res.send('Done');
  }

  async checkLeadStatus(req, res) {
    const orderId = req.params.orderId;
    const data = await Leads.findOne({ orderId }).select('firstName lastName email contactNo status orderId');
    return res.send(data);
  }

  async resendPasswordToUser(req, res) {
    const id = req.params.id;
    const token = generator.generate({
      length: 10,
      numbers: true,
    });

    const password = await this.hashPassword(token);
    const userRecord = await CmsUser.findByIdAndUpdate(id, { password }, { new: true });
    utils.resetPasswordEmailToUser({ email: userRecord.email, password: token });

    return res.send(true);
  }

  async getLeadViaCrmID(req, res) {
    const CRMID = req.params.id;
    const data = await Leads.findOne({ CRMID }).lean(true);
    if (!data) {
      return res.status(400).send('Not found');
    }
    if (data.leadOwnerId) {
      const result = await CmsUser.findById(data.leadOwnerId).lean();
      return res.send(result);
    } else {
      console.log('NOT FOUND ANYONE');
      return res.status(400).send({ msg: 'error' });
    }
  }

  async syncCrmLeadsStatus(req, res) {
    let { email, status } = req.body;
    const crmStatusUpdateDate = new Date();

    if (status == 'Closed Won') {
      status = 'BOOKED';
    }
    if (status == 'Closed Lost') {
      status = 'CANCELLED';
    }

    let updatedStatus = await Leads.updateOne({ email }, { $set: { status, crmStatusUpdateDate } });
    if (updatedStatus) {
      res.status(200).send({ message: 'Status updated successfully' });
    } else {
      res.status(204).send();
    }
  }

  async update_owner(req, res) {
    const data = await Leads.findOne({ CRMID: req.body.contact_id }).lean();
    if (data) {
      await Leads.updateOne(
        { CRMID: req.body.contact_id },
        {
          contact_owner: req.body.contact_owner,
        }
      );
    }
    res.send({ msg: 'ok' });
  }

  async createLeadFromUl(req, res) {
    let firstName = req.body.name || req.body.firstName;
    let lastName = firstName.split(' ')[1] || 'NA';
    let cityName = req.body.city;
    let message = req.body.messages.pop();
    let contactNo = req.body.contactNo;

    if (req.body.firstName) {
      firstName = req.body.firstName;
    }
    if (req.body.lastName) {
      lastName = req.body.lastName;
    }

    let {
      email,
      university,
      universityCRMID,
      budget,
      consultantId,
      leadSource,
      bdmId,
      universityId,
      nationality,
      gender,
      dateOfBirth,
      orderId,
      cityId,
      country
    } = req.body;
    let leadOwnerId = bdmId || consultantId;

    if (!cityId) {
      const x = await fetch('https://api-prod.universityliving.com/v1/cities/list');
      const y = await x.json();
      const find = y.data.find(m => m.name == cityName);
      if (find) {
        cityId = find._id;
      }
    }

    let output = {
      firstName,
      lastName,
      email,
      contactNo,
      university: universityId,
      universityName: university,
      cityName,
      city: cityId,
      budget,
      message,
      leadOwnerId,
      leadSource,
      universityCRMID,
      nationality,
      gender,
      dateOfBirth,
      orderId,
      country,
      leadOwnerCompanyName: leadSource,
      createdBy: { firstName: leadSource, companyName: leadSource }
    };

    try {
      await Leads.create(output);
    } catch (err) {
      if (err.code == 11000) {
        // duplicate lead alert
        utils.duplicateLeadAlert({
          ...output,
          duplicateKey: err.errmsg.includes('email') ? 'email' : 'contact',
        });
      }
      return res.send(false);
    }

    return res.send(true);
  }

  async brand(req, res) {
    const desiredURL = req.params.desiredURL;
    if (!desiredURL) {
      return res.status(400).send();
    }
    //   const data = await Brand.findOne({status:true,desiredURL}).select("-createdAt -updatedAt -_id -__v, -status -consultantName.profileImageUrl -consultantName.parentId -consultantName.updatedAt -consultantName.createdAt  -consultantName.contactNumber -consultantName.email -consultantName.address").lean(true);
    const data = await Vas.findOne({ pageUrlParam: desiredURL });
    return res.send({ data });
  }

  async userMigration(req, res) {
    const bdms = await Bdms.find().lean();
    const consultant = await Consultant.find().lean();

    const data = [];

    /*  for(let item of bdms){
      data.push({
        _id:item._id,
        firstName:item.firstName,
        lastName:item.lastName,
        email:item.email,
        contactNumber:item.contactNo,
        password:item.password,
        address:item.address,
        parentId:"5f07fd76d8dbaf6f4a442829",
        userRole:"Business Development",
        status:true,
        "createdAt" : item.createdAt,
        "updatedAt" : item.updatedAt
      });
    } */

    for (let item of consultant) {
      const city = cities.find((c) => c._id == item.city);
      data.push({
        _id: item._id,
        companyName: item.name,
        firstName: item.contactPerson.firstName,
        lastName: item.contactPerson.lastName,
        email: item.email,
        contactNumber: item.contactNo,
        password: item.password,
        city: item.city,
        address: item.address,
        country: city.countryId,
        userRole: 'Consultant',
        parentId: item.bdmId,
        status: true,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      });
    }

    await CmsUser.create(data);

    return res.send({});
  }

  async leadMigration(req, res) {
    const old = await Leads.find().distinct('email').lean();

    const data = await LeadOld.find({ email: { $nin: [old] } }).lean();
    // db.getCollection("leads").remove({email:{$ne:"p.kapoor@universityliving.com"}});

    //db.getCollection("leads").dropIndex("contactNo_1")
    //db.getCollection("leads").getIndexes()

    const result = [];
    for (let item of data) {
      const data = {
        budget: item.budget || undefined,
        city: item.city || undefined,
        cityName: item.city && cities.find((x) => x._id == item.city).name,
        leadOwnerId:
          item.bdmId || item.agentId || item.consultantId || item.agentId,
        contactNo: item.contactNo,
        country: item.city && cities.find((x) => x._id == item.city).country,
        createdBy: item.leadCreatedBy,
        dateOfBirth:
          new Date(item.dateOfBirth) != 'Invalid Date'
            ? new Date(item.dateOfBirth)
            : undefined,
        email: item.email,
        firstName: item.firstName,
        lastName: item.lastName,
        message: item.message,
        comments: item.comments,
        nationality: item.nationality || undefined,
        universityName:
          item.university &&
          university.find((x) => x._id == item.university).name,
        notesCRMId: item.notesCRMId || undefined,
        CRMID: item.CRMID || undefined,
        contact_owner: item.contact_owner || undefined,
        status: item.status || undefined,
        type: item.type || undefined,
        university: item.university || undefined,
        updated_by: item.updated_by || undefined,
        universityCRMID: item.universityCRMID || undefined,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };
      if (data.leadOwnerId) {
        const x = await CmsUser.findById(data.leadOwnerId)
          .select('companyName')
          .lean();

        if (x) {
          data.leadOwnerCompanyName = x.companyName;
        }
      }
      result.push(data);
    }

    await Leads.create(result);

    return res.send('Onde');
  }

  async checkOTP(req, res) {
    const { email, otp } = req.body;
    const userRecord = await CmsUser.findOne({ email });
    const time = moment(moment().format());
    const expired =
      moment.duration(time.diff(userRecord.otp.createdAt)).asMinutes() > 5;

    if (expired) return res.status(400).send({ msg: 'OTP Expired' });
    if (userRecord.otp.code !== Number(otp))
      return res.status(400).send({ msg: 'Incorrect OTP' });

    const token = generator.generate({
      length: 30,
      numbers: true,
    });
    await CmsUser.updateOne({ email }, { $set: { token } });

    return res.send({ token });
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

  async changePassword(req, res) {
    const { newPassword, token } = req.body;
    const password = await this.hashPassword(newPassword);
    const userRecord = await CmsUser.findOneAndUpdate({ token }, { password });

    return res.send('success');
  }

  async resetPassword(req, res) {
    const { email } = req.body;
    const otp = Math.floor(Math.random() * (9999 - 1000) + 1000);
    const userRecord = await CmsUser.findOne({ email });

    if (!userRecord) return res.status(400).send({ msg: 'Invalid email id!' });

    sendMailToUser(email, {
      subject: 'Reset Password OTP - LMS',
      html: otpEmail(otp),
    });

    const output = await CmsUser.findOneAndUpdate(
      { email },
      { otp: { code: otp, createdAt: moment().format() } },
      { new: true }
    );

    return res.send('success');
  }

  async upload(req, res) {
    const s3 = new aws.S3(); // Create a new instance of S3
    const fileType = req.body.fileType;
    const purpose = req.body.purpose;

    const fileName = generator.generate({
      length: 30,
      numbers: true,
    });

    let fullName = 'lms_server/' + fileName + '.' + fileType;

    // this is for amenities only
    // if (process.env.NODE_ENV == "production") {
    //   fullName = "cms/" + fileName + "." + fileType;
    // }

    // Set up the payload of what we are sending to the S3 api
    const s3Params = {
      Bucket: BUCKET_NAME,
      Key: fullName,
      Expires: 500,
      ContentType: fileType,
      ACL: 'public-read',
    };
    // Make a request to the S3 API to get a signed URL which we can use to upload our file
    s3.getSignedUrl('putObject', s3Params, (err, data) => {
      if (err) {
        console.log(err);
        return res.status(400).send(err);
      }
      // Data payload of what we are sending back, the url of the signedRequest and a URL where we can access the content after its saved.
      const returnData = {
        signedRequest: data,
        url: `https://cdn.universityliving.com/${fullName}`,
      };
      // Send it all back
      return res.send(returnData);
    });
  }
}
module.exports = MixController;
