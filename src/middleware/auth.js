const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // 1. Récupérer le header Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token manquant ou mal formaté' });
    }

    // 2. Extraire le token (après "Bearer ")
    const token = authHeader.split(' ')[1];

    // 3. Vérifier le token avec la clé secrète
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Retrouver l'utilisateur en base (sans le password)
    const user = await User.findById(decoded.id).select('-password');
    if (!user || user.status === 'deleted') {
      return res.status(401).json({ message: 'Utilisateur invalide ou supprimé' });
    }

    // 5. Attacher l'utilisateur à la requête pour les controllers suivants
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalide ou expiré' });
  }
};

module.exports = auth;