'use strict';
const jwt = require('jsonwebtoken');
const CmsUser = require('../resources/cms/cmsUser.model');
const SECRET = process.env.JWT_SECRET_KEY;
exports.issueToken = (user) => {
  const token = jwt.sign(user, SECRET, { expiresIn: '30d' });
  return ({ ...user, token });
};

exports.verifyToken = async(req, res, next) => {
  if(req.url == '/user/login' || req.url.includes('mix') || req.url.includes('vendor')){
    //by pass login only
    return next();
  }
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({
      message: 'Unauthorized! Please provide valid authorization token',
    });
  }
  try {
    const tokenData = jwt.verify(token.replace('JWT ', ''), SECRET);
    const user = await CmsUser.findById(tokenData._id);
    if (user) {
      req.user = user;
      return next();
    } else {
      return res.status(400).json({
        message: 'Invalid user',
      });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(401).json({
      message: 'Provided authorization token has expired!',
    });
  }
};