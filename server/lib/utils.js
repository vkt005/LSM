const nodemailer = require('nodemailer');
const generator = require('generate-password');
const AWS = require('aws-sdk');
const fetch = require('node-fetch');
const mongoose = require('mongoose');
const SchemaCommon = new mongoose.Schema({}, { strict: false });
const CRMLog = mongoose.model('crmlogs', SchemaCommon);
const config = require('../../config');
const moment = require ('moment');
const Lead = mongoose.model('Lead');
const CmsUser = mongoose.model('CmsUser');
const {sendEmailToUserLeadInsert,resetPasswordEmail}  = require('./emailData');

const smtpTransport = nodemailer.createTransport(config.emailConfig.hostDetails);
const BUCKET_NAME = config.AWSS3.BUCKET_NAME;
const s3 = new AWS.S3({
  accessKeyId: config.AWSS3.ACCESS_KEY,
  secretAccessKey: config.AWSS3.SECRET_KEY,
});

exports.mailer = (mailOptions) => {
  return smtpTransport.sendMail(mailOptions);
};

exports.sendMailToUser = (email, userTemplate, cb) => {
  this.mailer({
    from: config.adminEmails.admin1,
    to: email,
    replyTo: config.adminEmails.admin1,
    subject: userTemplate.subject,
    html: userTemplate.html,
  })
    .then(cb, () => {
      cb();
    })
    .catch(() => {
      cb();
    });
};
exports.sendMailToHR = (email, userTemplate, cb) => {
  this.mailer({
    from: config.adminEmails.admin1,
    to: email,
    replyTo: config.adminEmails.admin1,
    subject: userTemplate.subject,
    html: userTemplate.html,
  })
    .then(cb, () => {
      cb();
    })
    .catch(() => {
      cb();
    });
};
exports.sendMailToAdmin = (adminTemplate, cb) => {
  const result = {
    from: config.adminEmails.admin1,
    to: config.adminEmails.admin2,
    replyTo: config.adminEmails.admin1,
    // attachments: [
    //   {
    //     filename: 'footer-final-2-01.png',
    //     path: __dirname + '/icons/footer-final-2-01.png',
    //     cid: 'footer'
    //   }
    // ],
    subject: adminTemplate.subject,
    html: adminTemplate.html,
  };
  if (adminTemplate.cc && adminTemplate.cc.length) {
    result['cc'] = adminTemplate.cc;
  }
  this.mailer(result)
    .then(cb, () => {
      cb();
    })
    .catch(() => {
      cb();
    });
};

exports.walkClean = (obj) => {
  Object.entries(obj).forEach(([key, val]) => {
    if (val && typeof val === 'object') {
      this.walkClean(val);
    }
    if (val === null || val === '' || val === 'Invalid date' || typeof val === 'undefined') {
      delete obj[key];
    }
    if (val && typeof val === 'object' && !Object.entries(val).length) {
      delete obj[key];
    }
  });
  return obj;
};

exports.s3Upload = (file, fileName, mimetype, cb) => {
  const extension = '.' + fileName.split('.')[1];
  const finalName = generator.generate({ length: 30, numbers: true, strict: true }) + extension;

  const params = {
    Bucket: BUCKET_NAME,
    Key: 'images/' + finalName, // File name you want to save as in S3
    Body: file,
    ContentType: mimetype,
  };

  // Uploading files to the bucket
  s3.upload(params, async (err, data) => {
    if (err) {
      return cb(err);
    }
    //  console.log(err,data);
    const savedName = 'https://cdn.universityliving.com/images/' + finalName;
    return cb(null, savedName);
  });
};


exports.leadSource = async (leadOwnerId) => {
  const find = await CmsUser.findById(leadOwnerId).select('firstName lastName companyName userRole').lean();

  let leadSource = undefined;
  if(find){
    if(find.userRole == 'Business Development'){
      leadSource = `Internal Agent - ${find.firstName} ${find.lastName}`;
    }
    else if(find.userRole == 'Consultant'){
      leadSource = `Consultant - ${find.companyName ? find.companyName  : find.firstName} `;
    }
    else{
      leadSource = `Agent - ${find.firstName} ${find.lastName}`;
    }
  }
  return leadSource;
};

exports.insertContactToCRM = async (leadDetails)=>{
  console.log('Inserting in the ZOHO CRM');
  
  const dateAndTime = String(+new Date());
  const logData = { dateAndTime };

  let crmObj = leadDetails;
  const leadSource = await this.leadSource(crmObj.leadOwnerId);

  Object.assign(crmObj, config.CRM.mandatories);
  let crmContactsObj = {
    'Account_Name' : {
      'id': crmObj.universityCRMID || '3350382000004292001'
    },
    'Email': crmObj.email,
    'First_Name': crmObj.firstName,
    'Last_Name': crmObj.lastName,
    'Phone': crmObj.contactNo,
    'nationality' : crmObj.nationality,
    'Budget' : crmObj.budget,
    'Date_of_Birth' : crmObj.dateOfBirth ? moment(new Date(crmObj.dateOfBirth)).format('YYYY-MM-DD') : null,
    'messages':[crmObj.message] || undefined,
    'Lead_Source' : leadSource,
    'Platform':'LMS',
    'formType' : 'ENQUIRE-NOW',
    'isWebsiteEntry' : 'false',
    'Contact_Stage' :'Active',
    'status' : 'IN_PROCESS',
    'University_Country':crmObj.universityCountry,
    'University_City':crmObj.universityCity,
    'Other_University':crmObj.otherUniversity || undefined
  };
  config.CRM.header.method = 'POST';
  config.CRM.header.body = JSON.stringify({ data : [crmContactsObj]});
  logData.leadData = { data : [crmContactsObj]};

  let crmResponse = await fetch( config.CRM.endpoint + config.CRM.contactEndPointSlug, config.CRM.header).catch(console.error);
  let res = await crmResponse.json();

  if(res.data && res.data.length &&  res.data[0].code == 'DUPLICATE_DATA'){
    const plus2hours = +new Date(leadDetails.createdAt)+(172800*1000); // 2 days
    if(Date.now() < plus2hours  ){
      config.CRM.header.method = 'PUT';
      crmContactsObj.id = res.data[0].details.id;
      config.CRM.header.body = JSON.stringify({ data : [crmContactsObj]});
      crmResponse = await fetch( config.CRM.endpoint + config.CRM.contactEndPointSlug, config.CRM.header).catch(console.error);
      res = await crmResponse.json();
    }else{
      return true;
    }
  }

  logData.leadResponse = res;
  CRMLog.findOneAndUpdate({dateAndTime}, { ...logData }, { new: true, upsert: true }).then(() => {});

  if(res.data && res.data.length && res.data[0].code == 'SUCCESS'){
    await Lead.findByIdAndUpdate(crmObj.leadId ,{$set:{CRMID:res.data[0].details.id}}).catch(console.error);
    const url = `https://crm.zoho.com/crm/org670595648/tab/Contacts/${res.data[0].details.id}`;
    const adminTemplate = {
      subject: 'Leads get saved in CRM from LMS',
      html : `<html>
    <body>
        <img style="width:500px;" src="https://marketing-image-production.s3.amazonaws.com/uploads/574dedfe8ab845687ef49df96e82dedcaa79a8f33b2bb192064af678fb22aa6931a7e6985119af8512a4440de7b7b075cce3ca5c46e27421cc2d05e997452c47.jpg">
        <br><br>
        <div>Hello team,</div>
        <br>
        <br>
        Lead created successfully with the following email from LMS:
        <br>
        <br>
            <table>
                <tr>
                    <td><b>Email :</b></td>
                    <td> ${leadDetails.email} </td>
                </tr>
                  <tr>
                    <td><b>Mobile :</b></td>
                    <td> ${leadDetails.contactNo} </td>
                </tr>
            </table>
        <br>
        <p>URL : ${url}</p>
        <br>
        Cheers !
        <br><br>
        <b>Team University Living</b>
    </body>
  </html>`
    };

    this.sendMailToAdmin(adminTemplate, ()=>{
      console.log('Mail Sent Successfully');
    }); 
    return false;
  }else{
    console.error(res);
  }
};



exports.duplicateLeadAlert = async (lead)=>{
  const d = Array.isArray(lead) ? lead : [lead];
  let html = '<table border=\'1\' cellpadding=\'5\' cellspacing=\'0\'>';
  html += `<tr>
        <th>Duplicate Key</th>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Email</th>
        <th>Contact Number</th>
        <th>Budget</th>
        <th>Message</th>
    </tr>`;
  for(let item of d){
    html += '<tr>';
    html += `<td>${item['duplicateKey'] || ''}</td>`;
    html += `<td>${item['firstName']}</td>`;
    html += `<td>${item['lastName']}</td>`;
    html += `<td>${item['email']}</td>`;
    html += `<td>${item['contactNo']}</td>`;
    html += `<td>${item['budget']}</td>`;
    html += `<td>${item['message'] || ''}</td>`;
    html += '</tr>';
  }
  html += '</table>';
  this.mailer({
    from : config.adminEmails.admin1,
    to : process.env.DUPLICATE_EMAIL,
    replyTo : config.adminEmails.admin1,
    subject : 'LMS - Duplicate Lead Imported',
    html : `<html>
            <body>
                <div>               
                <h4>Hello team,</h4>
                Someone trying to upload duplicate leads but system discarded these leads. Please find the details.<br>
                <br>
                 ${html}
                <br>
                <br>
                Cheers !
                <br>
                <b>Team University Living</b>
                <br><br>
                </div>
            </body>
        </html>`
  }).then(res => console.log('Duplicate lead email sent')).catch(console.error);
};


exports.sendEmailToUserLeadInsert = async (lead)=>{
  let html = sendEmailToUserLeadInsert(lead);

  this.mailer({
    from : config.adminEmails.admin1,
    to : lead.email,
    replyTo : config.adminEmails.admin1,
    subject : 'Yay! We\'re Going to Find You the Perfect Room!',
    html:html,
  }).then(res => console.log('email successfully send to the user '+lead.email)).catch(console.error);
};


exports.resetPasswordEmailToUser = ({email,password}) => {
  let html = resetPasswordEmail(email,password);

  this.mailer({
    from : config.adminEmails.admin1,
    to : email,
    replyTo : config.adminEmails.admin1,
    subject : 'LMS Password Reset',
    html:html,
  }).then(res => console.log('email successfully send to the user '+email)).catch(console.error);
  
};
