const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Fonction utilitaire pour générer un JWT
const generateToken = (userId) => { //crée un JWT signé avec JWT_SECRET || source: https://stackoverflow.com/questions/72775186/create-an-object-in-a-static-function-in-mongoose-and-handle-its-result-from-rou

  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// POST /users/register
exports.register = async (req, res) => {
  try { // try pour gérer les erreurs potentielles lors de la création de l'utilisateur
    const { username, email, password } = req.body;

    // Vérifie si l'email ou le username existe déjà
    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return res.status(409).json({ // source: https://developer.mozilla.org/fr/docs/Web/HTTP/Reference/Status/409
        message: 'Cet email ou nom d\'utilisateur est déjà utilisé',
      });
    }

    // Créer l'utilisateur (le password sera haché automatiquement par le pre-save)
    const user = await User.create({ username, email, password });

    // Générer un token
    const token = generateToken(user._id); 
    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// POST /users/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Chercher l'utilisateur par email
    const user = await User.findOne({ email, status: 'active' }); // active => user soft-deleted ne peut pas se connecter
    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' }); // erreur 401 pour une authentification échouée || source: https://developer.mozilla.org/fr/docs/Web/HTTP/Status/401
    }

    // Vérifier le mot de passe
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Générer un token
    const token = generateToken(user._id);

    res.json({
      message: 'Connexion réussie',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};