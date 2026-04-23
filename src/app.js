const express = require('express');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');

const postRoutes = require('./routes/postRoutes');

const app = express();

// Middlewares globaux
app.use(cors());
app.use(express.json());

// Route de test
app.get('/', (req, res) => {
  res.json({ message: 'Blogify API est en ligne 🚀' });
});

app.use('/users', userRoutes);
app.use('/posts', postRoutes);

module.exports = app;