'use strict';
require('dotenv').config();
require('./server/lib/load.schemas'); // LOAD SCHEMAS

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect("mongodb://localhost:27017/LSM", {
  useMongoClient: true,
}, () => console.log('Successfully connected to DB'));

// mongoose.set("debug",true);
const app = require('./server');

module.exports = app.listen(process.env.PORT || 7000, () => {
  console.log(`Server is running on PORT ${process.env.PORT || 7000}`);
});
