const Contact = require('../models/contactUs.model');
const { sendEmail } = require('../helpers/emailHelper'); // Assumes you have a helper for sending emails
require("dotenv").config();


exports.contactUs = async (req, res) => {
  const { fullName, email, subject, message } = req.body;

  try {
    // Save the contact form submission in the database
    const newContact = new Contact({ fullName, email, subject, message });
    await newContact.save();

    // Prepare email content
    const emailContent = {
      to: process.env.ADMIN_MAIL, // Replace with admin's email
      subject: `New Contact Us Message from ${fullName}`,
      template: 'contactUs', // Dynamic template name
      context: {
        fullName,
        email,
        subject,
        message
      }
    };

    // Send email to admin
    await sendEmail(emailContent.to, emailContent.subject, emailContent.template, emailContent.context);

    return res.status(200).send({
      message: "Votre message a été envoyé avec succès.",
    });
  } catch (error) {
    console.error('Error details:', error);
    return res.status(500).send({
      message: "Une erreur s'est produite lors de l'envoi du message.",
      error: error.message
    });
  }
};
