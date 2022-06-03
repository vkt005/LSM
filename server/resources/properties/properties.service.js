/** @format */

'use strict';
const mongoose = require('mongoose');
const Property = mongoose.model('Property');
const config = require('../../../config');

const Utils = require('../../lib/utils');
const moment = require('moment');
const fetch = require('node-fetch');

class PropertiesService {
  async createProperty(property) {
    let createdProperty = new Property(property);
    await createdProperty.save();
    return createdProperty;
  }

  async findProperties(filter, page, limit = 10) {
    filter = JSON.parse(JSON.stringify(filter));
    return Property.find(filter)
      .sort({ distanceFromCityCenter: 1 })
      .lean(true)
      .limit(parseInt(limit))
      .skip((page - 1) * 10);
  }

  async findPropertyById(propertyId) {
    return Property.findOne({ _id: propertyId }).select(
      'name address thumbnail slug',
    );
  }

  async getPropertyDetailsBySlug({ propertyId }) {
    let property = await Property.findById(propertyId);
    return property;
  }

  async getAllProperties() {
    return Property.find()
      .select(
        'name slug city country enabled updatedAt provider citySlug countrySlug',
      )
      .sort({ enabled: -1 })
      .lean(true);
  }

  async getAllPropertiesOptions(searchTerm) {
    let condition = {};
    if (searchTerm) {
      condition = {
        name: {
          $regex: searchTerm,
          $options: 'i',
        },
      };
    }
    const propertiesData = await Property.find(condition, 'name')
      .sort({
        name: 1,
      })
      .limit(100);
    return propertiesData;
  }

  async getAllPropertiesByFilter(req) {
    let websiteUrl =
      process.env.NODE_ENV == 'production'
        ? 'https://www.universityliving.com'
        : 'https://beta.universityliving.com';
    let limit = 10;
    let skip = 0;
    let sort = { _id: -1 };
    let {
      provider,
      startDate,
      endDate,
      country,
      city,
      enabled,
      isNominated,
      isSuggested,
      isSoldOut,
      itemPerPage,
      pageNo,
      searchTerm,
      sortBy,
      csv,
    } = req;
    let matchConditions = [];

    if (sortBy) sort = sortBy;
    if (searchTerm)
      matchConditions.push({
        $or: [
          { name: { $regex: searchTerm, $options: 'i' } },
          { slug: { $regex: searchTerm, $options: 'i' } },
        ],
      });
    if (startDate)
      matchConditions.push({ createdAt: { $gte: new Date(startDate) } });
    if (startDate && endDate)
      matchConditions.push({
        createdAt: {
          $gte: new Date(startDate),
          $lt: moment(new Date(endDate))
            .add(1, 'days')
            .toDate(),
        },
      });
    if (country) matchConditions.push({ country: { $eq: country } });
    if (city) matchConditions.push({ city: { $eq: city } });
    if (provider) matchConditions.push({ provider: { $eq: provider } });

    enabled === true
      ? matchConditions.push({ enabled: { $eq: true } })
      : enabled === false
        ? matchConditions.push({ enabled: { $eq: false } })
        : null;
    isNominated === true
      ? matchConditions.push({ isNominated: { $eq: true } })
      : isNominated === false
        ? matchConditions.push({ isNominated: { $eq: false } })
        : null;
    isSoldOut === true
      ? matchConditions.push({ isSoldOut: { $eq: true } })
      : isSoldOut === false
        ? matchConditions.push({ isSoldOut: { $eq: false } })
        : null;
    isSuggested === true
      ? matchConditions.push({ isSuggested: { $eq: true } })
      : isSuggested === false
        ? matchConditions.push({ isSuggested: { $eq: false } })
        : null;

    if (pageNo) pageNo = parseInt(pageNo);
    if (itemPerPage) limit = parseInt(itemPerPage);

    skip = limit * (pageNo - 1);
    var itemCount = null;
    if (!matchConditions.length) {
      itemCount = await Property.count();
    } else {
      itemCount = await Property.count({ $and: matchConditions });
    }

    const query = [
      { $match: { $and: matchConditions } },
      { $sort: sort },
      {
        $project: {
          name: 1,
          slug: 1,
          city: 1,
          citySlug: 1,
          country: 1,
          countrySlug: 1,
          enabled: 1,
          updatedAt: 1,
          provider: 1,
          isNominated: 1,
          isSuggested: 1,
          createdAt: 1,
          websiteUrl: {
            $concat: [
              websiteUrl,
              '/',
              '$countrySlug',
              '/',
              '$citySlug',
              '/',
              '$slug',
            ],
          },
        },
      },
      { $skip: skip },
      { $limit: limit },
    ];

    if (!matchConditions.length) {
      query.shift();
    }

    if (csv) {
      query.splice(3, 2);
    }

    const results = await Property.aggregate(query);
    return {
      totalRecord: itemCount,
      pageNo: pageNo,
      data: results,
    };
  }
  sendNominatedEmail(data, status = '') {
    const nominateObj = {};
    const arr = [];
    nominateObj.Property = data.name;
    data.rooms.map(room => {
      room.types.map(type => {
        if (type.isNominated === true) {
          type.rates.map(rate => {
            // if (rate.allocatedRooms) {
            arr.push({
              Tenancy: rate.tenancy,
              Room_title: room.category,
              Type_title: type.title,
              Availability: rate.providerAvailability,
              AllocatedRoom: rate.allocatedRooms ? rate.allocatedRooms : 0,
            });
            // }
          });
        }
      });
    });
    nominateObj.Rooms = arr;

    let rooms = nominateObj.Rooms.map(e => {
      return `<tr>
              <td>${e.Tenancy}</td>
              <td>${e.Room_title}</td>
              <td>${e.Type_title}</td>
              <td>${e.Availability}</td>
              <td>${e.AllocatedRoom}</td>
          </tr>`;
    }).join(' ');

    const query = (() => {
      if (status === true) {
        return `Someone has <span style="color:green">ENABLED</span> <strong>${nominateObj.Property}</strong> nomination.`;
      } else if (status === false) {
        return `Someone has <span style="color:red">DISABLED</span> <strong>${nominateObj.Property}</strong> nomination.`;
      } else {
        return `Someone has updated <strong>${nominateObj.Property}</strong>.`;
      }
    })();

    let emailTemplate = {
      subject: `Property Nomination Alert : (${nominateObj.Property})`,
      html: `<html>
      <head>
      <style>td,th{padding:10px;text-align:center}</style>
      </head>
          <body>
              <br><br>
              <div>Hello team,</div>
              <br>
              ${query}
              <br>
              <br>
              <h2>Property : ${nominateObj.Property}</h2>
             <table border="1" style="border-collapse: collapse" > 
             <tr>
             <th>Tenancy</th>
             <th>Room Category</th>
             <th>Type</th>
             <th>Availability</th>
             <th>Allocated Rooms</th>
               </tr>
               <tr>
              ${rooms}
               </tr>
              </table>
            
             <br/><br/>
             Date & Time : ${moment
          .utc()
          .add(330, 'minutes')
          .format('llll')}
              <br> <br>
              Regards,
              <br><br>
              <b>Product Team <br/> University Living</b>
              <br><br>
            </body>
        </html>`,
    };

    Utils.sendMailToAdmin(emailTemplate);
  }

  async syncProperties(slug) {
    const property = await Property.findOne({ slug }).lean();
    await this.crmCall(property);
  }

  flatenProperty(property) {
    let crmProperty = [];
    property.rooms.map(room => {
      room.types.map(type => {
        type.rates.map(rate => {
          crmProperty.push({
            address: property.address,
            baseCurrencyCode: property.baseCurrencyCode,
            categoryId: room._id.toString(),
            Check_In_Date: rate.checkInDate ? moment(new Date(rate.checkInDate)).format('YYYY-MM-DD') : null,
            Check_Out_Date: rate.checkoutDate ? moment(new Date(rate.checkoutDate)).format('YYYY-MM-DD') : null,
            country: property.country,
            Discount: rate.discountedPrice,
            Offer_Info:
              property.offers.length > 0 ? property.offers[0].info.substring(0, 200) : '',
            Offer_Message: (property.offers.length && property.offers[0].message.substring(0, 1000)) || '',
            Price: rate.price,
            Price_Unit: rate.priceUnit,
            Product_Code: property._id.toString(),
            // Record_Image: property.thumbnail.url,
            Product_Name: property.name,
            Provider_s_Availability: rate.providerAvailability,
            // title: room.title, // TODO need to delete this
            // Room_Category_Offr_Info:
            //   room.offers.length > 0 ? room.offers[0].info : '', // TODO need to delete this
            // Room_Category_Offer_Message:
            //   room.offers.length > 0 ? room.offers[0].message : '', // TODO need to delete this
            Room_Category_Type: room.category,
            Room_Type_Name: type.title,
            Room_Type_Offer_Info:
              type.offers.length > 0 ? type.offers[0].info : '',
            Room_Type_Offer_Message: (type.offers.length && type.offers[0].message.substring(0, 200)) || '',
            roomTypeId: type._id.toString(),
            Tenancy: rate.tenancy,
            tenancyId: rate._id.toString(),
            type: property.type,
            CRMID: rate.CRMID || '',
            Tenancy_Flexibility: rate.checkInCheckoutFlexibility,
            Featured: '',
            Min_Price: property.minPrice,
            Image_Url: property.thumbnail && property.thumbnail.url,
            Property_Link:
              'www.universityliving.com/' +
              property.countrySlug +
              '/' +
              property.citySlug +
              '/' +
              property.slug,
            city: property.citySlug,
            Provider: property.provider,
            Rate_Enabled: 'true',
          });
        });
      });
    });
    return crmProperty;
  }

  async sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  async crmCall(savedProperty) {
    let property = Object.assign({}, savedProperty);
    let result = this.flatenProperty(property);
    const copyConfig = JSON.parse(JSON.stringify(config.CRM));

    for (let item of result) {
      await this.sleep(10000); // 30 seconds
      Object.assign(item, copyConfig.mandatories);
      if (item.CRMID) {
        item.id = item.CRMID;
        copyConfig.header.method = 'PUT';
      } else {
        copyConfig.header.method = 'POST';
      }
      copyConfig.header.body = JSON.stringify({ data: [item] });
      fetch(
        copyConfig.endpoint + copyConfig.productEndPointSlug,
        copyConfig.header,
      )
        .then(response => {
          return response.json();
        })
        .then(crmResponse => {
          console.log(
            '------------CMS--------CRM-----------RESPONSE-----' +
            JSON.stringify(crmResponse),
          );
          property.rooms.map(room => {
            room.types.map(type => {
              type.rates.map(rate => {
                if (rate._id == item.tenancyId) {
                  rate.CRMID = crmResponse.data[0].details.id;
                  property.isCRMID = true;
                }
              });
            });
          });
        })
        .then(() => {
          Property.findOneAndUpdate({ _id: result[0].Product_Code }, property, {
            new: true,
          }).exec((err, result) => {
            if (err) console.log(err);
          });
        });
    }
  }

  findRateBy(roomCategoryId, roomTypeId, rateId, oldData) {
    const room = oldData.rooms.find(x => x._id == roomCategoryId);
    if (!room) return false;
    const type = room.types.find(x => x._id == roomTypeId);
    if (!type) return false;
    const rate = type.rates.find(x => x._id == rateId);
    if (!rate) return false;
    return rate.CRMID ? rate.CRMID : null;
  }

  fixCrmIdIssue(newData, oldData) {
    newData.rooms.map(room => {
      if (!Array.isArray(room.types)) {
        return;
      }
      room.types.map(type => {
        if (!Array.isArray(type.rates)) {
          return;
        }
        type.rates.map(rate => {
          const CRMID = this.findRateBy(room._id, type._id, rate._id, oldData);
          if (CRMID) {
            rate.CRMID = CRMID;
          }
        });
      });
    });
  }

  async findOneAndUpdate(data, nominationChanges, requestedBy) {
    let result = data;
    let findProperty = null;

    if (!data.slug) {
      let createdProperty = new Property(data);
      await createdProperty.save();
      result = createdProperty;
    } else {
      findProperty = await Property.findOne({ slug: data.slug })
        .select('isNominated rooms')
        .lean();
      this.fixCrmIdIssue(data, findProperty);
      data.updatedAt = new Date();
      data.updatedBy = requestedBy._id;
      result = await Property.findOneAndUpdate({ slug: data.slug }, data, {
        new: true,
      });


    }

    // Nomination email start here
    if (findProperty) {
      const nominatedBefore = findProperty.isNominated;
      const nominatedAfter = result.isNominated;

      if (nominatedBefore != nominatedAfter) {
        this.sendNominatedEmail(data, nominatedAfter);
        console.log('Nomination changes detected');
      }
    }
    if (nominationChanges && result.isNominated == true) {
      console.log('Nomination changes detected 344');
      this.sendNominatedEmail(data);
    }
    // Nomination email end here

    // set minPrice and displayPrice from api server
    fetch(`${process.env.API_SERVER}mix/property-min-price/${result.slug}`).catch(console.error);
    return result;
  }

  async updatePropertiesOrder(data, requestedBy) {
    return await Promise.all(
      data.map(async (property, index) => {
        return await Property.findByIdAndUpdate(property.propertyId, {
          $set: {
            updatedBy: requestedBy._id,
            updatedAt: new Date(),
            listingOrder: property.updatedOrder
              ? property.updatedOrder
              : index + 1,
          },
        });
      }),
    );
  }
}

module.exports = new PropertiesService();
