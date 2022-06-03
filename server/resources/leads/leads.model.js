'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LEAD_STATUS = {
  CANCELLED: 'CANCELLED',
  IN_PROCESS: 'IN_PROCESS',
  BOOKED: 'BOOKED',
  APPLICATION_PROCESSED: 'APPLICATION_PROCESSED',
  'Closed Won': 'BOOKED',
  QUALIFIED: 'QUALIFIED',
  NOT_QUALIFIED: 'NOT_QUALIFIED',
};

let leadSchema = new Schema(
  {
    firstName: {
      type:String,
      trim:true
    },
    lastName: {
      type:String,
      trim:true
    },
    email: {
      type: String,
      index: true,
      lowercase: true,
      require: true,
      trim: true,
      unique: true,
    },
    contactNo: {
      type: String,
      index: true,
      require: true,
      unique: true,
      trim:true
    },
    dateOfBirth: Date,
    country: {
      type:String,
      trim:true
    },
    orderId:{
      type:String,
      trim:true
    },
    city: {
      type: Schema.Types.ObjectId,
    },
    cityName: {
      type:String,
      trim:true
    },
    universityName: {
      type:String,
      trim:true
    },
    otherUniversity:String,
    university: {
      default: null,
      type: Schema.Types.ObjectId,
    },
    universityCRMID: {
      type:String,
      trim:true
    },
    nationality: {
      type:String,
      trim:true
    },
    gender: {
      type:String,
      trim:true
    },
    budget: {
      type:String,
      trim:true
    },
    comments: {
      type:String,
      trim:true
    },
    message: {
      type:String,
      trim:true
    },
    type: {
      type:String,
      trim:true
    },
    leadOwnerId: {
      type: Schema.Types.ObjectId,
    },
    leadOwnerCompanyName: {
      type:String,
      trim:true
    },
    alreadyInTheCrm:{
      type:Boolean,
      default:false
    },
    qualifyingTime:Date,
    createdBy: Schema.Types.Mixed,
    updatedBy: Schema.Types.Mixed,
    status: {
      type: String,
      trim:true,
      default: LEAD_STATUS['IN_PROCESS'],
      enum: Object.values(LEAD_STATUS),
    },
    leadSource:{
      type:String,
      trim:true
    },
    crmStatusUpdateDate:{
      type:Date,
      select:false
    },
    contact_owner:{
      type:String,
      trim:true
    } ,
    CRMID:  {
      type:String,
      trim:true
    },
    notesCRMId:  {
      type:String,
      trim:true
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
    toJSON: {
      transform: function (doc, ret) {
        ret.leadId = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
    toObject: {
      transform: function (doc, ret) {
        ret.leadId = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

leadSchema.loadClass(class Lead {});
module.exports = mongoose.model('Lead', leadSchema);
