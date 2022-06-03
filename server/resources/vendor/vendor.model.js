'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const brandSchema = mongoose.Schema(
  {
    personalInfo: {
      firstName: String,
      lastName: String,
      email: String,
      mobile: String,
      dob: Date,
      gender: String,
      address: String,
      country: String,
      state: String,
      city: String,
      postcode: String,
      nationality: String,
    },
    universityInfo: {
      universityId: Schema.Types.ObjectId,
      courseName: String,
      yearOfStudy: String,
      startDate: Date,
      endDate: Date,
      CRMID: String,
      country:String,
      name:String,
      cityId:Schema.Types.ObjectId,
    },
    guardianInfo: {
      fullName: String,
      email: String,
      mobile: String,
      relationship: String,
      address: String,
      country: String,
      state: String,
      city: String,
      postcode: String,
      nationality: String,
    },
    propertyId: {
      type: Schema.Types.ObjectId,
      ref: 'Property',
    },
    message: String,
    leadSource: String,
    tenancyId: Schema.Types.ObjectId,
    categoryId: Schema.Types.ObjectId,
    roomId: Schema.Types.ObjectId,
    category: String,
    roomType: String,
    rate: {},
    orderId: String,
    CRMID: String,
    status: {
      type: String,
      default: 'INITIATED',
      enum: ['INITIATED', 'BOOKED', 'FAILED', 'CANCELLED', 'QUALIFIED'],
    },
    vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', private: true },
    property: {},
  },
  {
    timestamps: true,
    toObject: {
      transform: function (doc, ret) {
        delete ret._id;
        delete ret.__v;
        delete ret.id;
      },
    },
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret._id;
        delete ret.__v;
        delete ret.id;
      },
    },
  }
);

class Vendor {}
brandSchema.loadClass(Vendor);

module.exports = mongoose.model('vendorbookings', brandSchema);
