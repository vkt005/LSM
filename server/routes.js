'use strict';

let { registerAPIRoutes } = require('./resources/routes');
module.exports = function (app) {
  // Register public and API sepcific routes here
  registerAPIRoutes(app);
};

