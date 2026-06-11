const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { User } = require('../models');

dotenv.config();

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Brak tokena uwierzytelniającego.' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const user = await User.findByPk(payload.userId);
    if (!user) {
      return res.status(401).json({ message: 'Nieprawidłowy token.' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token jest nieprawidłowy lub wygasł.' });
  }
};

module.exports = authenticate;
