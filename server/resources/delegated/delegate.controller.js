/** @format */

'use strict';
const mongoose = require('mongoose');
const moment = require('moment');
const BaseController = require('../../lib/base.controller');
// const BrandsService = require("./brands.service");
const Delegates = mongoose.model('Delegate');

class DelegatesController extends BaseController {
  constructor(apiRouter, basePath) {
    super(apiRouter, basePath);
    this.registerRoutes();
  }
  registerRoutes() {
    this.router.get(
      `${this.basePath}`,
      this.handleAsyncErrors(this.getAllDelegates)
    );
    this.router.post(
      `${this.basePath}`,
      this.handleAsyncErrors(this.saveDelegate)
    );
    this.router.get(
      `${this.basePath}/:id`,
      this.handleAsyncErrors(this.getDelegate)
    );
  }

  async getAllDelegates(req, res) {
    let items = await Delegates.find();
    // let brands = await BrandsService.getAllBrandsByFilter(items);
    res.send(items);
  }

  async getDelegate(req, res) {
    const { id } = req.params;
    let delegate = await Delegates.findOne({ _id: id });
    // DelegatesService.getDelegateViaId(id);
    res.send(delegate);
  }

  async saveDelegate(req, res) {
    const { _id } = req.body;
    let output;

    req.body.startDate = moment(new Date(req.body.startDate)).startOf('day');
    req.body.endDate    = moment(new Date(req.body.endDate)).endOf('day');

    if (_id) {
      output = await Delegates.findOneAndUpdate({ _id: _id }, req.body, {
        new: true,
      });

      return res.send(output);
    }

    output = await Delegates.create(req.body);

    return res.send(output);
  }
}

module.exports = DelegatesController;
