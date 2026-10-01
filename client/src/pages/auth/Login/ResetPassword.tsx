import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../api/client';
import styles from '../../../styles/resetPassword.module.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/auth/reset-password/${token}`, { password });
      setMessage('Mot de passe réinitialisé ! Redirection…');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Token invalide ou expiré');
    }
  };

  return (
    <div className={styles.form_container}>
      <form onSubmit={handleSubmit} className={styles.reset_form}>
        <h1 className={styles.reset_title}>Nouveau mot de passe</h1>

        {message && <p className={styles.success}>{message}</p>}
        {error && <p className={styles.error}>{error}</p>}

                // CHAMP MOT DE PASSE - REMPLACER le bloc existant
        <div className={styles.reset_container}>
          <div className={styles.forgot_container}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Nouveau mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.forgotPassword_input}
              required
            />
            <button
              type="button"
              className={styles.togglePassword}
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <button type="submit" className={styles.forgot_button}>
            Valider
          </button>
        </div>
      </form>
    </div>
  );
}














