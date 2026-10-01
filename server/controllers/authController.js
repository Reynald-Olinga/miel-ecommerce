import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import transporter from '../utils/mailer.js';  
import crypto from 'crypto'; 

// @desc    Inscription utilisateur
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { email, password, phone } = req.body;
    console.log('Inscription utilisateur:', { body: req.body });
    
    // Validation des champs requis
    if (!email || !password || !phone) {
      return res.status(400).json({ error: 'Veuillez remplir tous les champs requis' });
    }

    // Vérification si l'utilisateur existe déjà
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé' });
    }

    // Création de l'utilisateur
    const user = await User.create({ email, password, phone });
    
    // Génération JWT
    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET || 'votre_secret_par_defaut', // Fallback pour le développement
      { expiresIn: '7d' }
    );

    res.status(201).json({ 
      token,
      id: user._id,
      email: user.email,
      phone: user.phone
    });
  } catch (err) {
    res.status(500).json({ 
      error: 'Erreur serveur',
      message: err.message 
    });
  }
};

// @desc    Connexion utilisateur
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    
    // Validation des champs
    if (!email || !password) {
      return res.status(400).json({ error: 'Veuillez fournir un email et un mot de passe' });
    }

    // Recherche de l'utilisateur
    const user = await User.findOne({ email }).select('+password');
    
    // Vérification des identifiants
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    // Génération du token JWT
    const token = jwt.sign(
      { id: user._id, role: user.role || 'user' }, // Inclure le rôle de l'utilisateur
      process.env.JWT_SECRET || 'votre_secret_par_defaut', // Fallback pour le développement
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    // Ne pas renvoyer le mot de passe
    user.password = undefined;

  res.status(200).json({
      success: true,
      token,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        phone: user.phone,
        role: user.role,
        name: user.name
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ 
      success: false,
      error: 'Erreur serveur',
      message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// @desc    Rafraîchir le token
// @route   POST /api/auth/refresh-token
// @access  Public
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: 'Refresh token requis'
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Utilisateur non trouvé'
      });
    }

    const newToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    res.json({
      success: true,
      token: newToken
    });

  } catch (err) {
    console.error('Refresh token error:', err);
    res.status(401).json({
      success: false,
      error: 'Refresh token invalide'
    });
  }
};

// @desc    Déconnexion utilisateur
// @route   POST /api/auth/logout
// @access  Privé
export const logout = (req, res) => {
  // Dans une vraie application, vous voudrez peut-être blacklister le token
  res.json({
    success: true,
    message: 'Déconnexion réussie'
  });
};

// Vérification d'email (optionnel)
export const checkEmail = async (req, res) => {
  try {
    const { email } = req.query;
    const user = await User.findOne({ email });
    res.json({ exists: !!user });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};


// @desc    Créer un compte admin (super-admin ou script)
// @route   POST /api/auth/register-admin
// @access  Privé – seul un admin peut en créer un autre
export const registerAdmin = async (req, res) => {
  try {
    const { email, password, phone } = req.body;

    if (!email || !password || !phone) {
      return res.status(400).json({ error: 'Tous les champs requis' });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: 'Email déjà utilisé' });

    const admin = await User.create({ email, password, phone, role: 'admin' });

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET || 'fallback',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: admin._id,
        email: admin.email,
        phone: admin.phone,
        role: admin.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur', message: err.message });
  }
};



// @desc    Demande de réinitialisation de mot de passe
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email requis' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'Utilisateur introuvable' });

    // Génération d’un token JWT unique (15 min)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });

    // Sauvegarde dans la base
    user.resetPasswordToken   = token;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    // Construction du lien
    const resetUrl = `${process.env.FRONT_URL}/reset-password/${token}`;

    // Envoi de l’e-mail
    await transporter.sendMail({
      from: `"Rucher 🐝" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: 'Réinitialisation de votre mot de passe',
      html: `
        <p>Bonjour,</p>
        <p>Pour réinitialiser votre mot de passe, cliquez sur le lien suivant (valable 15 min) :</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>Si vous n'êtes pas à l'origine de cette demande, ignorez ce mail.</p>
      `,
    });

    res.json({ message: 'E-mail envoyé à votre adresse' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur', message: err.message });
  }
};

// @desc    Réinitialisation effective (nouveau mot de passe)
// @route   POST /api/auth/reset-password/:token
// @access  Public
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) return res.status(400).json({ error: 'Mot de passe requis' });

    // Vérification et décodage du token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: decoded.id,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ error: 'Token invalide ou expiré' });

    // Mise à jour
    user.password = password;
    user.resetPasswordToken   = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Mot de passe réinitialisé avec succès' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur', message: err.message });
  }
};

