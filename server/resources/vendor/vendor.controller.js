'use strict';

const BaseController = require('../../lib/base.controller');
const mongoose = require('mongoose');
const VendorBooking = mongoose.model('vendorbookings');
const axios = require('axios');
const Leads = mongoose.model('Lead');


class VendorController extends BaseController {
  constructor(apiRouter, basePath) {
    super(apiRouter, basePath);
    this.registerRoutes();
  }
  registerRoutes() {
    this.router.get( `${this.basePath}/status/:orderId`, this.handleAsyncErrors(this.status) );
    this.router.post( `${this.basePath}/save`, this.handleAsyncErrors(this.save) );
  }

  async status(req, res) {
    let data = await VendorBooking.findOne({ orderId: req.params.orderId });
    const lead = await Leads.findOne({orderId:req.params.orderId}).select('status').lean();
    if(lead){
      data.status = lead.status;
    }
    res.status(200).send(data);
  }

  async save(req, res) {
    const data = await VendorBooking.create(req.body);
    try {
      await axios.post(
        'https://api-dashboard.universityliving.com/v1/mix/fromUl',
        {
          leadSource:data.personalInfo.firstName  +' - B2B API',
          email: data.personalInfo.email,
          name: data.personalInfo.firstName + ' ' + data.personalInfo.lastName,
          firstName: data.personalInfo.firstName,
          lastName: data.personalInfo.lastName,
          contactNo: data.personalInfo.mobile,
          messages: [data.message],
          nationality: data.personalInfo.nationality,
          gender: data.personalInfo.gender,
          dateOfBirth: data.personalInfo.dob,
          country:data.universityInfo.country,
          universityId: data.universityInfo.universityId,
          universityCRMID:data.universityInfo.CRMID,
          cityId:data.universityInfo.cityId,
          university:data.universityInfo.name,
          orderId: data.orderId,
          consultantId: req.body.vendor.consultantId,
          city: req.body.propertyCity,
        }
      );
    } catch (err) {
      console.error(err);
    }
    res.status(200).send(data);
  }
}

module.exports = VendorController;
