'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const brandSchema = new Schema(
  {
    brandingCompany: String,
    pageUrlParam: {
      type: String,
      unique: true
    },
    message: String,
    bannerImage: String,
    meta: {
      title: String,
      imageUrl: String,
      heading: String,
      subheading: String,
      keywords: String,
      description: String,
    },
    type: {
      type: String,
      enum: ['bdm', 'consultant'],
    },
    disable: Boolean,
    bdmId: {type: Schema.Types.ObjectId, ref: 'CmsUser'},
    consultantId: {type: Schema.Types.ObjectId, ref: 'CmsUser'},
    consultant: {
      label: String,
      value: String
    }
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
    toObject: {
      transform: function (doc, ret) {
        delete ret.id;
        delete ret.__v;
      },
    },
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.__v;
        delete ret.id;
      },
    },
  }
);

class Brand {}
brandSchema.loadClass(Brand);

module.exports = mongoose.model('VasMarketing', brandSchema);
