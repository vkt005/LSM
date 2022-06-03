/** @format */

'use strict';
const mongoose = require('mongoose');

const BaseController = require('../../lib/base.controller');
const Brands = mongoose.model('VasMarketing');

class BrandsController extends BaseController {
  constructor(apiRouter, basePath) {
    super(apiRouter, basePath);
    this.registerRoutes();
  }
  registerRoutes() {
    this.router.get(
      `${this.basePath}`,
      this.handleAsyncErrors(this.getAllBrands)
    );
    this.router.post(
      `${this.basePath}`,
      this.handleAsyncErrors(this.saveBrand)
    );
    this.router.get(
      `${this.basePath}/:id`,
      this.handleAsyncErrors(this.getBrand)
    );
  }

  async getAllBrands(req, res) {
    let items = await Brands.find().select(
      'brandingCompany pageUrlParam type disable bdmId consultantId updatedAt',
    ).populate(
      'consultantId',
      'firstName lastName userRole'
    ).populate(
      'bdmId',
      'firstName lastName userRole'
    ).sort({ updatedAt: -1 });
    res.send(items);
  }
  async getBrand(req, res) {
    const { id } = req.params;
    let brand = await Brands.findOne({ _id: id }).populate(
      'consultantId',
      'firstName lastName userRole'
    ).populate(
      'bdmId',
      'firstName lastName userRole'
    );
    res.send(brand);
  }
  async saveBrand(req, res) {
    const {
      body: { _id, pageUrlParam },
    } = req;
    let output;
    let condition = { pageUrlParam };
    if (_id) {
      condition._id = {
        $ne: _id,
      };
    }
    const urlExist = await Brands.findOne(condition);
    if (urlExist) {
      return res.status(400).send({ msg: 'This page url already in use.' });
    }
    if (_id) {
      output = await Brands.findOneAndUpdate({ _id: _id }, req.body, {
        new: true,
      });
      return res.send(output);
    }

    output = await Brands.create(req.body);

    return res.send(output);
  }
}

module.exports = BrandsController;
