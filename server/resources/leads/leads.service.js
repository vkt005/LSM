/** @format */

'use strict';
const mongoose = require('mongoose');
const moment = require('moment');
// const fetch = require("node-fetch");

const Leads = mongoose.model('Lead');
const CmsUser = mongoose.model('CmsUser');
const Delegate = mongoose.model('Delegate');
// const config = require("../../../config");
// const Utils = require("../../lib/utils");

class LeadsService {
  async getAllLeadsByFilter(req) {
    let limit = 10;
    let skip = 0;
    let sort = { _id: -1 };
    let {
      leadBy,
      company,
      // email,
      id,
      csv,
      status,
      startDate,
      endDate,
      itemPerPage,
      owner,
      pageNo,
      searchTerm,
      sortBy,
      type,
      university,
    } = req;
    let matchConditions = [];
    let itemCount = null;
    let ids,
      uniqueList,
      fromList = [];

    ids = [mongoose.Types.ObjectId(id)];

    let match = {
      _id: { $in: ids },
    };
    let sameRoleUserIds = [];
    const me = await CmsUser.findById(id).select('visibilityType userRole').lean();
    if(me && me.visibilityType == 'sameGroup'){
      sameRoleUserIds = await CmsUser.distinct('_id',{userRole:me.userRole}).lean();
      match = {
        userRole:me.userRole
      };
    }

    if (type === 'delegated') {
      const startTime = moment(new Date()).startOf('day');
      const endTime   = moment(new Date()).endOf('day');
      const match =   {
        $match: {
          'to._id': { $in: [id] },
          status: true,
          startDate: { $lte:  new Date(startTime)},
          endDate: { $gte:  new Date(endTime)},
        },
      };
      let list = await Delegate.aggregate([
        match,
        { $project: { from: 1, _id: 0 } },
      ]);
    
      ids = list.map((x) => {
        fromList.push(x.from._id);
        return mongoose.Types.ObjectId(x.from._id);
      });
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

    if (sortBy) sort = sortBy;
    if (searchTerm)
      matchConditions.push({
        $or: [
          { firstName: { $regex: searchTerm, $options: 'i' } },
          { lastName: { $regex: searchTerm, $options: 'i' } },
          { email: { $regex: searchTerm, $options: 'i' } },
          { contactNo: { $regex: searchTerm, $options: 'i' } },
          { contact_owner: { $regex: searchTerm, $options: 'i' } },
          // { "createdBy.firstName": { $regex: searchTerm, $options: "i" } },
        ],
      });
    if (university) matchConditions.push({ university: university });
    if (leadBy) matchConditions.push({ 'createdBy.firstName': leadBy });
    if (company) matchConditions.push({ leadOwnerCompanyName: company });
    if (owner) matchConditions.push({ contact_owner: owner });
    if (startDate)
      matchConditions.push({ createdAt: { $gte: new Date(startDate) } });
    if (startDate && endDate)
      matchConditions.push({
        createdAt: {
          $gte: new Date(startDate),
          $lt: moment(new Date(endDate)).add(1, 'days').toDate(),
        },
      });
    if (status) matchConditions.push({ status: { $eq: status } });
    // if (city) matchConditions.push({ city: { $eq: city } });
    // if (provider) matchConditions.push({ provider: { $eq: provider } });

    // enabled === true ? matchConditions.push({ enabled: { $eq: true } }) : enabled === false ? matchConditions.push({ enabled: { $eq: false } }) : null;

    if (pageNo) pageNo = parseInt(pageNo);
    if (itemPerPage) limit = parseInt(itemPerPage);

    skip = limit * (pageNo - 1);
    uniqueList = new Set(child.map(x => x._id + '').concat(fromList, id,sameRoleUserIds));

    if (type === 'delegated') uniqueList.delete(id);

    child = [...uniqueList].map((x) => mongoose.Types.ObjectId(x));
    matchConditions.push({ leadOwnerId: { $in: [...child] } });

    if (!matchConditions.length)
      itemCount = await Leads.count({ leadOwnerId: { $in: [...child] } });
    else
      itemCount = await Leads.count({
        $and: matchConditions,
      });

    const query = [
      {
        $match: { $and: matchConditions },
      },
      { $sort: sort },
      {
        $project: {
          // firstName: 1,
          // lastName: 1,
          city: 1,
          status: 1,
          contact_owner: 1,
          createdBy: 1,
          // email: 1,
          // contactNo: 1,
          updatedAt: 1,
          createdAt: 1,
          leadOwnerCompanyName: 1,
          name: {
            // $concat: [
            //   "$firstName",
            //   " ",
            //   "$lastName",
            //   "\n",
            //   "$email",
            //   "\n",
            //   "$contactNo",
            // ],
            firstName: '$firstName',
            lastName: '$lastName',
            email: '$email',
            contactNo: '$contactNo',
          },
          universityName: 1,
        },
      },
      { $skip: skip },
      { $limit: limit },
    ];

    if (!matchConditions.length) query.shift();
    if (csv) {
      query.splice(3, 2);
    }
    const results = await Leads.aggregate(query);

    return {
      totalRecord: itemCount,
      pageNo: pageNo,
      data: results,
    };
  }

  async getLeadViaId(id) {
    const lead = await Leads.findById(id);

    return lead;
  }
}

module.exports = new LeadsService();
