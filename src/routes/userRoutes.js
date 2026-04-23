const express = require('express');
const {register , login} = require('../controllers/userController');

const router = express.Router(); // Crée un routeur Express pour les routes utilisateur

// Routes d'authentification
router.post('/register', register);
router.post('/login', login);

module.exports = router;