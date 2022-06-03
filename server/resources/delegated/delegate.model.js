'use strict';
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const delegateSchema = new Schema({
  from: Schema.Types.Mixed,
  to: [Schema.Types.Mixed],
  status: Boolean,
  startDate: Date,
  endDate: Date,
  createdBy: Schema.Types.Mixed,
  updatedBy: Schema.Types.Mixed,
});

delegateSchema.loadClass(class Delegate {});
module.exports = mongoose.model('Delegate', delegateSchema);
