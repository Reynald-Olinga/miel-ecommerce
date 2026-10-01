import { defineConfig} from 'vite';
import React from 'react';
import { useState } from 'react';
import styles from '../styles/contact.module.css';



const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ici vous ajouterez la logique pour envoyer le formulaire
    console.log('Formulaire soumis:', formData);
    // Exemple d'appel API :
    // await axios.post('/api/contact', formData);
  };

  return (
    <div className={styles.contactContainer}>
      <h1 className="heading-secondary">Contactez-nous</h1>
      
      <div className={styles.contactGrid}>
        <div className={styles.contactForm}>
          <h2>Envoyez-nous un message</h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Nom complet</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="subject">Sujet</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>
            
            <button type="submit" className={styles.submitButton}>
              Envoyer le message
            </button>
          </form>
        </div>
        
        <div className={styles.contactInfo}>
          <h2>Nos coordonnées</h2>
          
          <div className={styles.infoItem}>
            <h3>Adresse</h3>
            <p>Cameroun Yaoundé Bastos </p>
          </div>
          
          <div className={styles.infoItem}>
            <h3>Téléphone</h3>
            <p>+237 6 52 39 62 35 </p>
          </div>
          
          <div className={styles.infoItem}>
            <h3>Email</h3>
            <p>warrenkegne@gmail.com</p>
          </div>
          
          <div className={styles.infoItem}>
            <h3>Horaires d'ouverture</h3>
            <p>Lundi - Vendredi: 9h - 18h</p>
            <p>Samedi: 10h - 16h</p>
            <p>Dimanche: Fermé</p>
          </div>
          
          <div className={styles.mapContainer}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.99144060821!2d2.292292615509614!3d48.85837360866186!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e2964e34e2d%3A0x8ddca9ee380ef7e0!2sTour%20Eiffel!5e0!3m2!1sfr!2sfr!4v1623251234567!5m2!1sfr!2sfr"
              width="100%"
              height="300"
              className={styles.mapIframe}
              allowFullScreen
              loading="lazy"
              title="Localisation de notre boutique sur la carte"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
