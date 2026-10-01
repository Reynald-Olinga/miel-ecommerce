// models/userModel.js
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    name: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
    },
    passwordChangedAt: Date,
    resetPasswordToken: String,          // <-- AJOUTÉ : stocke le token JWT ou uuid
    resetPasswordExpires: Date,          // <-- AJOUTÉ : date d’expiration du token
  },
  { timestamps: true }
);

// Hash du mot de passe avant sauvegarde
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// Méthode pour vérifier si le mot de passe a été changé après l’émission du JWT
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Méthode statique pour créer un admin via script ou CLI
userSchema.statics.createAdmin = async function ({ email, password, phone, name }) {
  return this.create({ email, password, phone, name, role: 'admin' });
};

export default mongoose.model('User', userSchema);



































































































// // models/userModel.js
// import mongoose from 'mongoose';
// import bcrypt from 'bcrypt';

// const userSchema = new mongoose.Schema(
//   {
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       match: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
//     },
//     password: {
//       type: String,
//       required: true,
//       minlength: 8,
//       select: false,
//     },
//     role: {
//       type: String,
//       enum: ['user', 'admin'],
//       default: 'user',
//     },
//     name: {
//       type: String,
//       trim: true,
//     },
//     phone: {
//       type: String,
//     },
//     passwordChangedAt: Date, // <-- ajouté
//   },
//   { timestamps: true }
// );

// // Hash du mot de passe avant sauvegarde
// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next();
//   this.password = await bcrypt.hash(this.password, 12);
//   this.passwordChangedAt = Date.now() - 1000; // <-- ajouté
//   next();
// });

// // Méthode pour vérifier si le mot de passe a été changé après l’émission du JWT
// userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
//   if (this.passwordChangedAt) {
//     const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
//     return JWTTimestamp < changedTimestamp;
//   }
//   return false;
// };

// // Méthode statique pour créer un admin via script ou CLI
// userSchema.statics.createAdmin = async function ({ email, password, phone, name }) {
//   return this.create({ email, password, phone, name, role: 'admin' });
// };

// export default mongoose.model('User', userSchema);




























































