const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Le nom d\'utilisateur est requis'],
      unique: true, // Assure que chaque nom d'utilisateur est unique
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: [true, 'L\'email est requis'],
      unique: true, // Assure que chaque email est unique
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Format de l\'email invalide'], // Validation de l'email avec une expression régulière || source: https://stackoverflow.com/questions/77122094/how-to-use-match-in-schema-while-using-mongoose
    },
    password: {
      type: String,
      required: [true, 'Le mot de passe est requis'],
      minlength: 6, // Assure que le mot de passe a au moins 6 caractères
    },
    status: {
      type: String,
      enum: ['active', 'deleted'], // Permet le soft delete en changeant le statut de l'utilisateur || source: https://mongoosejs.com/docs/schematypes.html#string-validators
      default: 'active',
    },
  },
  { timestamps: true } // Ajoute automatiquement les champs createdAt et updatedAt || source: https://mongoosejs.com/docs/guide.html#timestamps
);

// Hash automatique du mot de passe avant sauvegarde source: https://stackoverflow.com/questions/14588032/mongoose-password-hashing
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Ne hash que si le mot de passe a été modifié ou est nouveau
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Méthode d'instance pour comparer un mot de passe en clair avec le hash || source: https://stackoverflow.com/questions/14588032/mongoose-password-hashing
userSchema.methods.comparePassword = function (candidatePassword) { 
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);