/** @format */

'use strict';
const mongoose = require('mongoose');

const BaseController = require('../../lib/base.controller');
const LeadsService = require('./leads.service');
const Leads = mongoose.model('Lead');
const utils = require('../../lib/utils');
const CmsUser = mongoose.model('CmsUser');
const axios = require('axios');


class LeadsController extends BaseController {
  constructor(apiRouter, basePath) {
    super(apiRouter, basePath);
    this.registerRoutes();
  }

  registerRoutes() {
    this.router.post(
      `${this.basePath}`,
      this.handleAsyncErrors(this.getAllLeads)
    );
    this.router.post(
      `${this.basePath}/save`,
      this.handleAsyncErrors(this.saveLead)
    );
    this.router.post(
      `${this.basePath}/xls`,
      this.handleAsyncErrors(this.uploadExcel)
    );
   
    this.router.post(
      `${this.basePath}/createdBy`,
      this.handleAsyncErrors(this.getCreatedby)
    );
    this.router.post(
      `${this.basePath}/company`,
      this.handleAsyncErrors(this.getCompany)
    );
    this.router.post(
      `${this.basePath}/owner`,
      this.handleAsyncErrors(this.getCRMOwner)
    );
    this.router.get(
      `${this.basePath}/:id`,
      this.handleAsyncErrors(this.getLead)
    );
  }

  async getAllLeads(req, res) {
    let items = req.body;
    let leads = await LeadsService.getAllLeadsByFilter(items);

    res.send(leads);
  }

  async getLead(req, res) {
    const { id } = req.params;
    let lead = await LeadsService.getLeadViaId(id);

    res.send(lead);
  }

  async getCreatedby(req, res) {
    const list = await Leads.distinct('createdBy.firstName');

    res.send(list);
  }

  async getCRMOwner(req, res) {
    const list = await Leads.distinct('contact_owner', {
      contact_owner: { $ne: null },
    });

    res.send(list);
  }

  async getCompany(req, res) {

    let match = {
      _id: { $in:  [mongoose.Types.ObjectId(req.user._id)] },
    };

    const me = await CmsUser.findOne({ email: req.user.email }).select("visibilityType userRole").lean();
    if (me && me.visibilityType == "sameGroup") {
      match = {
        userRole: me.userRole,
      };
    }

    let child = await CmsUser.aggregate([
      {
        $match: match
      },
      {
        $graphLookup: {
          from: 'cmsusers',
          startWith: '$_id',
          connectFromField: '_id',
          connectToField: 'parentId',
          as: 'Childs',
        },
      },
      { $project: { Childs: 1 } },
      { $unwind: '$Childs' },
      {
        $project: {
          _id: '$Childs._id',
        },
      },
    ]);

    const ids = new Set(child.map(x => x._id));
    const list = await CmsUser.distinct('companyName',{_id:{$in:[...ids]}});

    res.send(list);
  }

  async saveLead(req, res) {
    const { id,contactNo,email } = req.body;
    let output;


    if(!req.body.status){
      req.body.status = 'IN_PROCESS';
    }

    let duplicate=false;
    const checkIfLeadExistsInCRM = await axios.get(`https://api-prod.universityliving.com/v1/mix/contactExists?email=${email.trim()}&contactNumber=${contactNo.trim()}`).catch(console.error);
    if(id && checkIfLeadExistsInCRM.data){
      const user = await Leads.findById(id).select('email contactNo').lean();
      if(user){
        if(user.email != email){
          duplicate=true;
        }
        if(user.contactNo != contactNo){
          duplicate=true;
        }
      }
    }else{
      if(checkIfLeadExistsInCRM.data){
        duplicate=true;
      }
    }

    if(duplicate){
      utils.duplicateLeadAlert({...req.body});
      return res.status(400).send({msg:'Duplicate Lead. Lead already exists in the CRM'});
    }


    try{
      if (id) {
        output = await Leads.findOneAndUpdate({ _id: id }, req.body, { new: true,runValidators: true });
      }else{
        if(req.body.leadOwnerId == '61addcd01d420fcdb6cd7cc0'){ // if lead from harini@universityliving.com send a email to the user
          utils.sendEmailToUserLeadInsert(req.body);
        }
        output = await Leads.create(req.body);
        // send curated property email
        await axios.post('https://api-prod.universityliving.com/v1/mix/lmsLeadsCuratedProperty',req.body).catch(console.error);
      }
    }catch(err){
      console.log(err);
      if(err.code == 11000){ // duplicate lead alert
        utils.duplicateLeadAlert({...req.body,duplicateKey:err.errmsg.includes('email') ? 'email' : 'contact'});
        if(err.errmsg.includes('email')){
          return res.status(400).send({msg:'Duplicate Email Id'});
        }else{
          return res.status(400).send({msg:'Duplicate Contact No'});
        }
      }
    }

    let error;
    if(output && output.get('status') == 'QUALIFIED'  && !output.get('CRMID')){
      output =  JSON.parse(JSON.stringify(output));
      output.universityCity=req.body.universityCity;
      output.universityCountry = req.body.universityCountry;
      error =  await utils.insertContactToCRM(output);
    }

    if(error == true){
      await Leads.findOneAndUpdate({ _id: id }, {qualifyingTime:new Date(),alreadyInTheCrm:true});
      return res.status(400).send({msg:'Lead already exists in the CRM'});
    }else{
      return res.send(output);
    }

  }

  async uploadExcel(req, res) {
    const data = JSON.parse(req.body.file).values();
    const { createdBy, leadOwnerCompanyName, leadOwnerId } = req.body;
    const dataList = [];
    const errorList = [];
    const duplicateLeads = [];

    while (true) {
      const { value, done } = data.next();

      if (done) break;

      const {
        firstName,
        lastName,
        email,
        dateOfBirth,
        nationality,
        budget,
        universityName,
        cityName,
      } = value;
      let {contactNo} = value;
      if(!contactNo.includes('+')){
        contactNo = '+'+contactNo; 
      }
      console.log(contactNo);
      const isDuplicateEmail = await Leads.findOne( { email: email }, { email: 1 } ).lean();
      const isDuplicateNo = await Leads.findOne( { contactNo: contactNo }, { contactNo: 1 } ).lean();
      const obj = {};

      if (isDuplicateEmail && isDuplicateEmail.email) obj.email = `Email: ${email}`;
      if (isDuplicateNo && isDuplicateNo.contactNo) obj.contactNo = `ContactNo: ${contactNo}`;

      let output = {
        firstName,
        lastName,
        email,
        contactNo,
        universityName,
        cityName,
        budget,
        nationality,
        dateOfBirth,
        leadOwnerCompanyName,
        leadOwnerId,
        createdBy,
      };

      if (isDuplicateEmail || isDuplicateNo){
        errorList.push(obj);
        duplicateLeads.push(output);
      }else{
        dataList.push(output);
      }        
    }

    await Leads.insertMany(dataList);
    if(duplicateLeads.length){
      utils.duplicateLeadAlert(duplicateLeads);
    }

    return res.send( errorList.length ?  errorList.push(dataList.length) && errorList : 'Success' );
  }

  
}

module.exports = LeadsController;
