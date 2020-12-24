const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (options) => {
  const msg = {
    to: options.email,
    from: process.env.FROM_EMAIL,
    subject: options.subject,
    html: options.message,
  };

  await sgMail.send(msg);
};

module.exports = sendEmail;
