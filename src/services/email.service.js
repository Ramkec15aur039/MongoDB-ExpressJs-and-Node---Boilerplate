const nodemailer = require('nodemailer');
// const inlineBase64 = require("nodemailer-plugin-inline-base64");
const fs = require('fs');
const handlebars = require('handlebars');
const { promisify } = require('util');
// const path = require("path");
const config = require('../config');
const logger = require('../config/logger');

const readFile = promisify(fs.readFile);
const transport = nodemailer.createTransport(config.email.smtp);
/* istanbul ignore next */
if (config.env !== '') {
  transport
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch(() => logger.warn(
      'Unable to connect to email server. Make sure you have configured the SMTP options in .env',
    ));
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
const sendEmail = async (to, subject, text, html) => {
  // transport.use("compile", inlineBase64());
  const msg = {
    from: config.email.from,
    to,
    subject,
    text,
    html,
  };
  try {
    await transport.sendMail(msg);
  } catch (e) {
    console.log(e);
    logger.error(e);
  }
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendResetPasswordEmail = async (to, token) => {
  const subject = 'Reset password';
  // replace this url with the link to the reset password page of your front-end app
  const resetPasswordUrl = `http://link-to-app/reset-password?token=${token}`;
  const text = `Dear user,
  To reset your password, click on this link: ${resetPasswordUrl}
  If you did not request any password resets, then ignore this email.`;
  const html = await readFile('./src/emailTemplate/forgotPassword.hbs', 'utf8');
  const template = handlebars.compile(html, { strict: true });
  const adminData = {
    body: text,
  };
  const result = template(adminData);
  await sendEmail(to, subject, text, result);
};

const sendCanditateLink = async (candidateInfo, token, type) => {
  try {
    let subject = '';
    let text = '';

    if (type === 'offerLetter') {
      subject = 'Candidate Login';
      const applicationStatusUrl = `${config.frontEndUrl}/home/onboarding/temporaryAccess?token=${token.access.token}`;
      text = `<h5><strong>Dear ${candidateInfo.firstName}</strong>,</h5>
      We are pleased to offer you the position of  here at ${
  (candidateInfo
          && candidateInfo.clinicalRole.length
          && candidateInfo.clinicalRole[0].clinicalTitle)
        || (candidateInfo
          && candidateInfo.administrativeRole.length
          && candidateInfo.administrativeRole[0].adminTitle)
        || 'cardio'
}. Please review the offer letter linked below, and let us know if you have any questions. We hope to see you sign the offer, and look forward to having you join our team!.
      <div><a href=${applicationStatusUrl}>Click to view Offer Letter</a></div>
      `;
    } else if (type === 'contract') {
      subject = 'Contract';
      const applicationStatusUrl = `${config.frontEndUrl}/home/onboarding/temporaryAccess?token=${token.accessToken}&type=contract`;
      text = `<h5><strong>Dear ${candidateInfo.firstName}</strong>,</h5>
      A contract has been sent to you. Please sign the contract.
      

      <div><a href=${applicationStatusUrl}>Click to view contract</a></div>
      `;
    }
    // replace this url with the link to the reset password page of your front-e
    const html = await readFile('./src/emailTemplate/newTemplate.hbs', 'utf8');
    const template = handlebars.compile(html, { strict: true });
    const adminData = {
      body: text,
    };
    const result = template(adminData);
    await sendEmail(candidateInfo.personalEmail, subject, text, result).then(
      (res) => {
        logger.info('candidate token access mail send', res);
      },
    );
  } catch (e) {
    logger.error(e);
  }
};

const sendOfferLetter = async (candidateDetails, mail, password) => {
  try {
    console.log(candidateDetails, 'email service');
    const subject = 'Login Credential';
    // replace this url with the link to the reset password page of your front-end app
    const applicationStatusUrl = `${config.frontEndUrl}/`;
    const text = `<p><strong>Dear ${candidateDetails.firstName}</strong>,</p>
  <p>We are pleased to inform that  you are become an employee of our  organization for the position ${
  (candidateDetails
      && candidateDetails.clinicalRole.length
      && candidateDetails.clinicalRole[0].clinicalTitle)
    || 'cardio'
}.</p>
  <div>
  <h3>Login Crendential:</h3>
    <p><b>EMAIL:</b> ${mail}
    <p><b>PASSWORD:</b> ${password}
  </div>
  <p>Thank you,</p>
  <div><a href=${applicationStatusUrl}>Login Page</a></div>`;
    const html = await readFile('./src/emailTemplate/newTemplate.hbs', 'utf8');
    const template = handlebars.compile(html, { strict: true });
    const adminData = {
      body: text,
      offerLetterLink: applicationStatusUrl,
    };
    const result = template(adminData);
    await sendEmail(candidateDetails.personalEmail, subject, text, result);
  } catch (e) {
    logger.error(e);
  }
};

const taskNotificationMail = async (recipient, type) => {
  try {
    console.log(recipient, 'email service task notification');
    const subject = 'Task Notification';
    // replace this url with the link to the reset password page of your front-end app
    const applicationStatusUrl = `${config.frontEndUrl}`;
    let text;
    if (type === 'offerLetter') {
      text = `<p><strong>Dear ${recipient.firstName}</strong>,</p>
   <p>A task is awaiting for your approval.To approve click the link below,</p>
   <div>
   <div><a href='${applicationStatusUrl}home/task'>Approve</a></div>`;
    } else if (type === 'createContract') {
      text = `<p><strong>Dear ${recipient.firstName}</strong>,</p>
  <p>An candidate has accepted the offer letter.To create contract click the link below,</p>
  <div>
  <div><a href='${applicationStatusUrl}home/task'>Create Contract</a></div>`;
    } else if (type === 'approveContract') {
      text = `<p><strong>Dear ${recipient.firstName}</strong>,</p>
   <p>A task is awaiting for your approval.To approve click the link below,</p>
   <div>
   <div><a href='${applicationStatusUrl}home/task'>Approve</a></div>`;
    } else if (type === 'signContract') {
      text = `<p><strong>Dear ${recipient.firstName}</strong>,</p>
   <p>A task is awaiting for your Signature.To sign the contract click the link below,</p>
   <div>
   <div><a href='${applicationStatusUrl}home/task'>Approve</a></div>`;
    } else if (type === 'resendOffer') {
      text = `<p><strong>Dear ${recipient.firstName}</strong>,</p>
   <p>A Offer has resent to you.To edit the offer click the link below,</p>
   <div>
   <div><a href='${applicationStatusUrl}home/task'>Approve</a></div>`;
    } else if (type === 'resendContract') {
      text = `<p><strong>Dear ${recipient.firstName}</strong>,</p>
   <p>A Contract has resent to you.To edit the offer click the link below,</p>
   <div>
   <div><a href='${applicationStatusUrl}home/task'>Approve</a></div>`;
    } else if (type === 'salaryIncreaseAction') {
      text = `<p><strong>Dear ${recipient.firstName}</strong>,</p>
   <p>A User is Eligible for salary increase action.To approve the task click the link below,</p>
   <div>
   <div><a href='${applicationStatusUrl}home/task'>Approve</a></div>`;
    }
    const html = await readFile('./src/emailTemplate/newTemplate.hbs', 'utf8');
    const template = handlebars.compile(html, { strict: true });
    const taskData = {
      body: text,
    };
    const result = template(taskData);
    await sendEmail(recipient.workEmail, subject, text, result);
  } catch (e) {
    logger.error(e);
  }
};

const onboardingSuccessMail = async (recipient) => {
  try {
    console.log(recipient, 'email service task notification');
    const subject = 'New Candidate Onboarded Successfully';
    // replace this url with the link to the reset password page of your front-end app
    // const applicationStatusUrl = `${config.frontEndUrl}/`;
    const text = `<p><strong>Dear ${recipient.firstName}</strong>,</p>
   <p>A new employee has been succesfully onboarded,</p>
   <div>`;
    const html = await readFile('./src/emailTemplate/newTemplate.hbs', 'utf8');
    const template = handlebars.compile(html, { strict: true });
    const taskData = {
      body: text,
    };
    const result = template(taskData);
    await sendEmail(recipient.workEmail, subject, text, result);
  } catch (e) {
    logger.error(e);
  }
};

const onboardingRejectionNotification = async (recipient, type) => {
  try {
    console.log(recipient, 'email service task notification');
    let subject = 'Offer Denied Notification';
    // replace this url with the link to the reset password page of your front-end app
    // const applicationStatusUrl = `${config.frontEndUrl}/`;
    let text;
    if (type === 'offerLetter') {
      subject = 'Offer Denied Notification';
      text = `<p><strong>Dear ${recipient.firstName}</strong>,</p>
   <p>A Candidate has denied the offer letter,</p>
   <div>`;
      //  <div><a href='${applicationStatusUrl}home/task'>Approve</a></div>`;
    } else if (type === 'contract') {
      subject = 'Contract Denied Notification';
      text = `<p><strong>Dear ${recipient.firstName}</strong>,</p>
  <p>An candidate has denied the contract,</p>
  <div>`;
      // <div><a href='${applicationStatusUrl}home/task'>Create Contract</a></div>`;
    }
    const html = await readFile('./src/emailTemplate/newTemplate.hbs', 'utf8');
    const template = handlebars.compile(html, { strict: true });
    const taskData = {
      body: text,
    };
    const result = template(taskData);
    await sendEmail(recipient.workEmail, subject, text, result);
  } catch (e) {
    logger.error(e);
  }
};

const requestTimeOffMail = async (recipient, data) => {
  try {
    console.log(recipient, data, 'email service task notification');
    const subject = 'Leave Request';
    // replace this url with the link to the reset password page of your front-end app
    const applicationStatusUrl = `${config.frontEndUrl}/home/leaves`;
    const text = `<p><strong>Dear ${data.managerName}</strong>,</p>
      <p>${data.requestorName} has requested for sick time off, from ${data.fromDate} to ${data.toDate}</p>
      <div><a href=${applicationStatusUrl}>Click to Approve/Reject Request</a></div>`;
    const html = await readFile('./src/emailTemplate/newTemplate.hbs', 'utf8');
    const template = handlebars.compile(html, { strict: true });
    const taskData = {
      body: text,
    };
    const result = template(taskData);
    await sendEmail(recipient, subject, text, result);
  } catch (e) {
    logger.error(e);
  }
};

const todoNotificationMail = async (recipientData, type) => {
  try {
    console.log(recipientData, type);
    const subject = 'Todo Notification';
    // replace this url with the link to the reset password page of your front-end app
    const applicationStatusUrl = `${config.frontEndUrl}/home/todoList`;
    let text = '';
    if (type === 'signatureRequest') {
      text = `<p><strong>Dear ${recipientData.firstName}</strong>,</p>
      <p>A document is waiting to be signed</p>
      <div><a href=${applicationStatusUrl}>Click to View Document</a></div>`;
    } else {
      text = `<p><strong>Dear ${recipientData.firstName}</strong>,</p>
       <p> A Task is waiting for your approval</p>
       <div><a href=${applicationStatusUrl}>Click to Approve/Reject</a></div>`;
    }
    const html = await readFile('./src/emailTemplate/newTemplate.hbs', 'utf8');
    const template = handlebars.compile(html, { strict: true });
    const taskData = {
      body: text,
    };
    const result = template(taskData);
    await sendEmail(recipientData.workEmail, subject, text, result);
  } catch (e) {
    logger.error(e);
  }
};
const todoRejectionNotificationMail = async (recipientData, data, type) => {
  try {
    console.log(recipientData, type);
    const subject = 'Todo Denied';
    // replace this url with the link to the reset password page of your front-end app
    const applicationStatusUrl = `${config.frontEndUrl}/home/todoList`;
    let text = '';
    if (type === 'requestTimeOff') {
      text = `<p><strong>Dear ${recipientData.firstName}</strong>,</p>
      <p>Your request Timeoff is denied.</p>
      <table>
									
      <colgroup>
        <col span="1">
        </colgroup>
      <tr>
        <th style="width:100px">Status&nbsp;:</th>
        <td style="width:500px;text-transform: capitalize;font-style:normal;">${data.status}</td>
      </tr>
      <tr>
        <th style="width:100px">Reason:</th>
        <td style="width:500px;text-transform: capitalize;font-style:normal;">${data.reasonForRejection}</td>
      </tr>
     
    </table>`;
    } else if (type === 'requestTimecard') {
      text = `<p><strong>Dear ${recipientData.firstName}</strong>,</p>
      <p>Your request Timecard is denied.</p>
      <table>
									
      <colgroup>
        <col span="1">
        </colgroup>
      <tr>
        <th style="width:100px">Status&nbsp;:</th>
        <td style="width:500px;text-transform: capitalize;font-style:normal;">${data.status}</td>
      </tr>
      <tr>
        <th style="width:100px">Reason:</th>
        <td style="width:500px;text-transform: capitalize;font-style:normal;">${data.reasonForRejection}</td>
      </tr>
     
    </table>`;
    }
    const html = await readFile('./src/emailTemplate/newTemplate.hbs', 'utf8');
    const template = handlebars.compile(html, { strict: true });
    const taskData = {
      body: text,
    };
    const result = template(taskData);
    await sendEmail(recipientData.workEmail, subject, text, result);
  } catch (e) {
    logger.error(e);
  }
};
module.exports = {
  sendEmail,
  sendResetPasswordEmail,
  sendCanditateLink,
  sendOfferLetter,
  taskNotificationMail,
  onboardingSuccessMail,
  onboardingRejectionNotification,
  requestTimeOffMail,
  todoNotificationMail,
  todoRejectionNotificationMail,
};
