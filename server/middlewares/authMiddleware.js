import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import logger from '../utils/logger.js';

// Version corrigée de la fonction protect (j'ai fusionné les deux versions qui se chevauchaient)
export const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Récupérer le token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // 2. Vérification présence du token (c'était dupliqué dans l'ancienne version)
    if (!token) {
      logger.error('Tentative d\'accès non autorisée - Token manquant');
      return res.status(401).json({ 
        success: false,
        message: 'Non autorisé : Token manquant',
        errorCode: 'MISSING_TOKEN'
      });
    }

    // 3. Vérification du token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    logger.debug(`Token décodé pour l'utilisateur ID: ${decoded.id}`);

    // 4. Récupération de l'utilisateur
    const currentUser = await User.findById(decoded.id).select('-password');
    if (!currentUser) {
      logger.error(`Utilisateur introuvable pour le token (ID: ${decoded.id})`);
      return res.status(401).json({
        success: false,
        message: 'L\'utilisateur associé à ce token n\'existe plus',
        errorCode: 'USER_NOT_FOUND'
      });
    }

    // 5. Vérification du changement de mot de passe
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      logger.warn(`Token invalide - Mot de passe changé (User: ${currentUser._id})`);
      return res.status(401).json({
        success: false,
        message: 'Token invalide : mot de passe récemment modifié',
        errorCode: 'PASSWORD_CHANGED'
      });
    }

    // 6. Ajout de l'utilisateur à la requête
    req.user = currentUser;
    logger.info(`Utilisateur authentifié : ${currentUser._id}`);
    next();

  } catch (err) {
    logger.error(`Erreur d'authentification : ${err.message}`);

    let errorMessage = 'Token invalide';
    if (err.name === 'TokenExpiredError') {
      errorMessage = 'Token expiré';
    } else if (err.name === 'JsonWebTokenError') {
      errorMessage = 'Token malformé';
    }

    res.status(401).json({
      success: false,
      message: `Non autorisé : ${errorMessage}`,
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
      errorCode: err.name || 'INVALID_TOKEN'
    });
  }
};

// Le reste du code (admin et restrictTo) reste inchangé
export const admin = (req, res, next) => {
  if (!req.user) {
    logger.error('Tentative d\'accès admin sans authentification');
    return res.status(401).json({
      success: false,
      message: 'Authentification requise',
      errorCode: 'NOT_AUTHENTICATED'
    });
  }

  if (req.user.role !== 'admin') {
    logger.warn(`Tentative d'accès admin non autorisé par l'utilisateur ${req.user._id}`);
    return res.status(403).json({
      success: false,
      message: 'Accès réservé aux administrateurs',
      errorCode: 'ADMIN_REQUIRED',
      requiredRole: 'admin',
      currentRole: req.user.role
    });
  }

  logger.info(`Accès admin autorisé pour ${req.user.email}`);
  next();
};

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Vous n\'avez pas les permissions nécessaires'
      });
    }
    next();
  };
};