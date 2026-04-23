const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper pour générer un token JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// POST /users/register
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return res.status(409).json({ message: 'Email ou username déjà utilisé' });
    }

    const user = await User.create({ username, email, password });
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'Inscription réussie',
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// POST /users/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, status: 'active' });
    if (!user) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    const token = generateToken(user._id);
    res.status(200).json({
      message: 'Connexion réussie',
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// GET /users/:id
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user || user.status === 'deleted') {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// PUT /users/:id (seul le user lui-même peut modifier son profil)
const updateUser = async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    const { username, email, password } = req.body;
    const user = await User.findById(req.params.id);
    if (!user || user.status === 'deleted') {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (password) user.password = password; // sera re-haché par le hook pre('save')

    await user.save();
    res.status(200).json({
      message: 'Profil mis à jour',
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// DELETE /users/:id (soft delete)
const deleteUser = async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    const user = await User.findById(req.params.id);
    if (!user || user.status === 'deleted') {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }

    user.status = 'deleted';
    await user.save();
    res.status(200).json({ message: 'Compte supprimé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

module.exports = { register, login, getUserById, updateUser, deleteUser };