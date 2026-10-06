// client/src/pages/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../../styles/auth.module.css';
import { authAPI } from '../../../api/authAPI';
import { useContext } from 'react';
import { AuthCtx } from '../../../context/AuthContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

// 👇 Préfixe de base : '/' en dev, '/miel-ecommerce/' en build de production
const BASE = import.meta.env.BASE_URL;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthCtx); // ← on utilise le contexte

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(email, password); // ← appel direct au contexte
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login_container">
      <div className={styles.authContainer}>
        <video src={`${BASE}images/4778263_Person_Honeycomb_1920x1080.mp4`} className={styles.login_background} loop autoPlay playsInline></video>
        <div className={styles.authForm}>
          <h2 className="authForm_title">Connexion</h2>

          {error && <div className={styles.errorMessage}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password">Mot de passe</label>
              <div className={styles.passwordContainer}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={styles.passwordInput}
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
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </form>

          <div className={styles.authLinks}>
            <p>
              Pas encore de compte ?{' '}
              <a href="/signup">S'inscrire</a>
            </p>
            <p>
              <a href="/forgot-password">Mot de passe oublié ?</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;






















