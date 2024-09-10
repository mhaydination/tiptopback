const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactUs.controller');

//contactUs validator 
const { getValidationRules, handleValidationErrors } = require('../validators/contactUs.validator');

module.exports = function (app) {
  
 app.post('/contact-us', [
    ...getValidationRules('contactUs'),  // Apply validation rules
    handleValidationErrors,              // Handle validation errors
    contactController.contactUs           // Controller function
  ]);
};
