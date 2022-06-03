'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    token: String,
    password: {
      type: String,
      trim: true,
      select: false,
    },
    contactNumber: String,
    otherCity: String,
    profileImageUrl: {
      type: String,
      required: false,
    },
    companyName: String,
    country: String,
    city: String,
    address: String,
    userRole: String,
    parentId: {
      type: Schema.Types.ObjectId,
    },
    otp: Schema.Types.Mixed,
    status: Boolean,
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
        delete ret.password;
      },
    },
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.__v;
        delete ret.id;
        delete ret.password;
      },
    },
  }
);

class CmsUser { }
userSchema.loadClass(CmsUser);

module.exports = mongoose.model('CmsUser', userSchema);
