import express from 'express';
import { sendContactEmail } from '../controllers/contactController.js';

const router = express.Router();

router.post('/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Validation simple
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs sont obligatoires'
      });
    }
    
    // Envoyer l'email (à implémenter)
    await sendContactEmail(name, email, subject, message);
    
    res.json({
      success: true,
      message: 'Votre message a été envoyé avec succès'
    });
  } catch (err) {
    console.error('Erreur contact:', err);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'envoi du message'
    });
  }
});

export default router;