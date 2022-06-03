'use strict';
require('winston-daily-rotate-file');
const expressWinston = require('express-winston');
const {transports, createLogger,format} = require('winston');
const SlackHook = require('winston-slack-webhook-transport');
const {ignoredRoutes}  = require('../config/index');
const moment = require('moment');
const mongoose = require('mongoose');
const fetch = require('node-fetch');
const thingSchema = new mongoose.Schema({}, { strict: false });
const Thing = mongoose.model('Logger', thingSchema);


const myFormat = format.printf(({ level, message, timestamp }) => {
  return `${moment(new Date(timestamp)).format('DD-MM-YYYY HH:mm:s')} ${level.toUpperCase()}: ${message}`;
});


module.exports = function (app) {    
  expressWinston.requestWhitelist.push('body');
  expressWinston.responseWhitelist.push('body');
  // expressWinston.responseWhitelist.push("_headers");
  expressWinston.bodyBlacklist.push(
    'password',
    'key',
    'iv',
    'secret',
    'token'
  );
    
    
  app.use(
    expressWinston.logger({
      ignoredRoutes: ignoredRoutes.where,
      expressFormat: true,
      //baseMeta:{time:new Date()}, // add new key to data
      skip: function (req, res) {
        // Not log if status code 304
        if(res.statusCode == 304){
          return true;
        }

        // only log if user agent match (This is optional for testing purpose only)
        if(process.env.LOG_USER_AGENT){
          return (req.header('user-agent').indexOf(process.env.LOG_USER_AGENT) > -1) ? false : true;
        }

        for (let item of ignoredRoutes.like) {
          let regex = new RegExp(item, 'i');
          if ((req.url.match(regex))) {
            return true;
          }
        }
        return false;
      },
      transports: [
        new transports.DailyRotateFile({
          dirname: './logs',
          filename: 'access-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '1g',
          maxFiles: '6d',
          eol: '\r\n\r\n***************************************************************************************\r\n\r\n',
        })
      ]
    }));
};

const logger =  createLogger({
  format: format.combine(
    format.timestamp(),
    myFormat,
    //format.colorize()
  ),
  exceptionHandlers: [
    new transports.File({filename: './logs/exceptions.log',}),
    new transports.Console({colorize:true,prettyPrint:true})
  ],
  transports: [
    new transports.File({
      filename: './logs/error.log',
      level: 'error',
    }),
    new transports.File({
      filename: './logs/activity.log',
      level: 'info',
    }),
    /* new SlackHook({
        webhookUrl: slackWebHook,
        level: 'error',
        formatter: (info) => ({
          //text: `${process.argv[1].match(/[\w-]+\.js/gi)}`, 
          text: `${info.level.toUpperCase()} : ${new Date(info.timestamp)}`, 
          attachments: [
            {
              text: `${info.message}`
            }
          ],
        })
      }) */
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console());
}


const logReqDb = (req, res,next) =>  {
  const oldWrite = res.write;
  const oldEnd = res.end;
  const chunks = [];
  res.write = (...restArgs) => {
    chunks.push(Buffer.from(restArgs[0]));
    oldWrite.apply(res, restArgs);
  };
  res.end = (...restArgs) => {
    if (restArgs[0]) {
      chunks.push(Buffer.from(restArgs[0]));
    }
    let body = Buffer.concat(chunks).toString('utf8');
      
    try{
      body = JSON.parse(body);
    }catch(e){
      body = body;
    }

    const data = {
      time: new Date(),
      date: new Date().toString(),
      fromIP: req.ip || req.headers['x-forwarded-for'] ||  req.connection.remoteAddress,
      method: req.method,
      originalUri: req.originalUrl,
      uri: req.url,
      user:req.user || null,
      requestData: req.body || null,
      responseData:  body || null,
      referer: req.headers.referer || '',
      ua: req.headers['user-agent'] || '',
      reqHeader : req.headers,
      //resHeader: res.getHeaders(),
      statusCode : res.statusCode
    };

    if(res.statusCode != 304){
      const thing = new Thing(data);
      thing.save();
    }
    oldEnd.apply(res, restArgs);
  };
  next();
};


const slackLog = (channelWebHookUrl,subject,body) => {
  fetch(channelWebHookUrl, {
    method: 'POST',
    body: JSON.stringify(
      {
        text:subject,
        attachments: [
          {
            text: body
          }
        ]})
  });
};

module.exports.logReqDb = logReqDb;
module.exports.logger = logger;
module.exports.slackLog = slackLog;