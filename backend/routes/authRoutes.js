const express = require('express');
const { body } = require('express-validator');
const { register, login, me } = require('../controllers/authController');
const authenticate = require('../middlewares/authMiddleware');
const validateRequest = require('../middlewares/validationMiddleware');

const router = express.Router();

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Imię jest wymagane.'),
    body('email').isEmail().withMessage('Podaj prawidłowy adres e-mail.'),
    body('password').isLength({ min: 6 }).withMessage('Hasło musi mieć co najmniej 6 znaków.'),
  ],
  validateRequest,
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Podaj prawidłowy adres e-mail.'),
    body('password').notEmpty().withMessage('Hasło jest wymagane.'),
  ],
  validateRequest,
  login
);

router.get('/me', authenticate, me);

module.exports = router;
