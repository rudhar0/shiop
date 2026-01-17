const nodemailer = require('nodemailer');
require('dotenv').config();  // Make sure you have a .env file with your email credentials

const sendEmail = async ({ recipient, subject, html, attachments, text }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER,  // Your Gmail address
        pass: process.env.GMAIL_PASS,  // Your Gmail password (use app password if 2FA is enabled)
      },
    });

    const mailOptions = {
      from: `<${process.env.GMAIL_USER}>`,  // Sender address
      to: recipient,
      subject: subject,
      html: html,
      attachments: attachments,
      text: text,  // Optional field for plain text version of the email
    };

    let info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.log(error);
  }
};

exports.sendEmail = async (args) => {
  if (!process.env.NODE_ENV === 'development') {
    return Promise.resolve();
  } else {
   
    return sendEmail(args);
  }
};
