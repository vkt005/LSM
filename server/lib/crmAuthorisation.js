'use strict';

const fetch = require('node-fetch');

exports.crmAuth = async () => {
  //Mnagement Dashboard Account in CRM
  let Accounts_URL = 'https://accounts.zoho.com';
  let client_id = '1000.337366U39BKFPR589JQ7OET2R91POB'; // ZohoCRM.modules.ALL,ZohoCRM.bulk.ALL,ZohoCRM.coql.READ
  let client_secret = 'feaf88ba8395ffab1f651cc890a2239b9391b9e928';
  let refresh_token = '1000.fed997122319edceb874f3ea786334f9.4b5cb2396b82e3653b040f0632d572e7';

  let refereshAccessTokenAPIUrl = Accounts_URL + '/oauth/v2/token?refresh_token=' + refresh_token +
    '&client_id=' + client_id + '&client_secret=' + client_secret + '&grant_type=refresh_token';
  let header = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  };

  let refereshRes = await fetch(refereshAccessTokenAPIUrl, header);
  let res = await refereshRes.json();
  let refereshedAccessToken = 'Zoho-oauthtoken ' + res.access_token;
  return refereshedAccessToken;

};



