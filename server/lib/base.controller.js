'use strict';
const { logReqDb } = require('../logger');

class BaseController {
  constructor(router, basePath) {
    if (!router || !basePath) throw Error('Incomplete Arguments');
    this.router = router;
    this.basePath = basePath;
  }

  handleAsyncErrors(fn) {
    return this.catchErrors(fn.bind(this));
  }

  catchErrors(fn) {
    return function (req, res, next) {
      return fn(req, res, next).catch(next);
    };
  }

  logger(req, res, next) {
    logReqDb(req, res, next);
  }
}

module.exports = BaseController;
