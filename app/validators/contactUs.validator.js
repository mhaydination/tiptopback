// helpers/validator.js

const { check, validationResult } = require('express-validator');

// Function to get validation rules based on type
const getValidationRules = (type) => {
  switch (type) {
    case 'contactUs':
      return [
        check('fullName').notEmpty().withMessage('Le nom complet est requis.'),
        check('email').isEmail().withMessage('Adresse email invalide.'),
        check('subject').notEmpty().withMessage('Le sujet est requis.'),
        check('message').notEmpty().withMessage('Le message est requis.')
      ];
    default:
      return [];
  }
};

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Échec de la validation.',
      errors: errors.array()
    });
  }
  next();
};

module.exports = {
  getValidationRules,
  handleValidationErrors
};
