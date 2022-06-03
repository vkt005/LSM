'use strict';
let crmAuthorisationHeader = require ('../server/lib/crmAuthorisation');
const cron = require('node-cron');

// Application configuration - environment settings here are the same across all environments.
let config = {
  adminEmails: {
    admin1: 'University Living <admin@universityliving.com>',
    admin2:
      process.env.NODE_ENV == 'production'
        ? 'University Living <admin@universityliving.com>'
        : 'University Living <developer@universityliving.com>',
  },
  AWSS3: {
    ACCESS_KEY: 'AKIAZZIXWBOYBPSRKFWG',
    SECRET_KEY: '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',
    BUCKET_NAME: 'unilivingcdn',
    REGION: 'ap-south-1',
  },
  emailConfig: {
    hostDetails: {
      host: 'email-smtp.us-east-1.amazonaws.com',
      port: 2587,
      auth: {
        user: 'AKIAICZ3D3AX3MCYT3PQ',
        pass: 'AhEmcWT21i0n5XGSONEpIcYKmnSQAHmFg4t6nudud24O',
      },
    },
  },
  ignoredRoutes: {
    where: ['/', '/favicon.ico', '/v1/countries'],
    like: ['/v1/search'],
  },
  CRM : {
    endpoint : 'https://www.zohoapis.com/crm/v2/',
    leadEndPointSlug : 'Leads',
    contactEndPointSlug : 'Contacts',
    productEndPointSlug : 'Products',
    universityEndPointSlug : 'Accounts',
    bookingEndPointSlug : 'Potentials',
    invoiceEndPointSlug : 'Invoices',
    vasEndPointSlug : 'VAS',
    header : {
      method: 'POST'
    },
    mandatories : {
      'Company': 'Universityliving Pvt. Ltd.'
    }
  },
};


async function setCrmAccessToken(){
  let auth = await crmAuthorisationHeader.crmAuth();
  config.CRM.header.headers = {
    'Content-Type': 'application/json',
    'Authorization': auth
  };
}
/* config.CRM.header.headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Zoho-oauthtoken 1000.67c34aa0cdd26821682df2504ed9a285.77523ba740de05ab479dd7a1679d2d32'
}; */


if(process.env.NODE_ENV === 'production'){
  cron.schedule('*/58 * * * *', () => {
    console.log('___________________CRON JOB STARTED FOR CRM AUTHORISATION TOKEN_______________________');
    setCrmAccessToken();
  });
  setCrmAccessToken();
}

// Export final configuration object
module.exports = config;
