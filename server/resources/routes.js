/** @format */

'use strict';

const CmsUserController = require('./cms/cmsUser.controller');
const PropertiesController = require('./properties/properties.controller');
const LeadsController = require('./leads/leads.controller');
const BrandsController = require('./brands/brands.controller');
const MixController = require('./mix.controller');
const DelegatesController = require('./delegated/delegate.controller');
const VendorController = require('./vendor/vendor.controller');
const WebinarController = require("./webinars/webinar.controller")
const Jwt = require('../lib/jwt');

exports.registerAPIRoutes = app => {
  let apiRouter = require('express').Router();
  app.use('/v1', apiRouter);

  new CmsUserController(apiRouter, '/user');
  new PropertiesController(apiRouter, '/properties');
  new LeadsController(apiRouter, '/leads');
  new BrandsController(apiRouter, '/brands');
  new DelegatesController(apiRouter, '/delegate');
  new VendorController(apiRouter, '/vendor');
  new MixController(apiRouter, '/mix'); // no token needed in this routes this one is open
  new WebinarController(apiRouter, '/webinar');

};
