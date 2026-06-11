const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { sequelize, createDatabaseIfNotExists } = require('./models');
const authRoutes = require('./routes/authRoutes');
const articleRoutes = require('./routes/articleRoutes');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Wystąpił błąd serwera.' });
});

const port = process.env.PORT || 3000;

createDatabaseIfNotExists()
  .then(() => sequelize.authenticate())
  .then(() => {
    console.log('Połączono z bazą MySQL.');
    app.listen(port, () => {
      console.log(`Serwer działa na http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('Nie można połączyć się z bazą:', err);
  });
