const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Configure Handlebars
const handlebarOptions = {
  viewEngine: {
    extName: '.hbs',
    partialsDir: path.join(__dirname, '..', 'views'),
    defaultLayout: false
  },
  viewPath: path.join(__dirname, '..', 'views'),
  extName: '.hbs',
};

transporter.use('compile', hbs(handlebarOptions));

exports.sendEmail = async (to, subject, template, context) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    template,
    context
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
