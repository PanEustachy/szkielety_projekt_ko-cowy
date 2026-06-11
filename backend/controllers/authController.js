const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { User } = require('../models');

dotenv.config();

const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  const existing = await User.findOne({ where: { email } });
  if (existing) {
    return res.status(409).json({ message: 'Użytkownik o takim adresie e-mail już istnieje.' });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const newUser = await User.create({ name, email, passwordHash, role: role || 'user' });

  return res.status(201).json({ id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });

  if (!user) {
    return res.status(401).json({ message: 'Nieprawidłowy e-mail lub hasło.' });
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    return res.status(401).json({ message: 'Nieprawidłowy e-mail lub hasło.' });
  }

  const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '12h',
  });

  return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
};

const me = async (req, res) => {
  const { id, name, email, role } = req.user;
  return res.json({ id, name, email, role });
};

module.exports = {
  register,
  login,
  me,
};
