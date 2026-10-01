import React, { useState, useEffect } from 'react';
//import { FaUser, FaLock, FaEnvelope, FaPhone, FaHoneyPot } from 'react-icons/fa';
import { Link, useNavigate, useRouteError } from 'react-router-dom';
import styles from '../../../styles/Signup.module.css';
import commonStyles from '../../../styles/auth.module.css';
//import  authAPI  from '../api/authAPI';
import  {authAPI}  from '../../../api/authAPI';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

// 👇 Préfixe de base : '/' en dev, '/miel-ecommerce/' en build de production
const BASE = import.meta.env.BASE_URL;


interface FormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export default function Signup() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const routeError = useRouteError();

  useEffect(() => {
    if (routeError) {
      console.error('Route error in Signup:', routeError);
      setError('Une erreur est survenue lors du chargement de la page');
    }
  }, [routeError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
      setError('Tous les champs sont obligatoires');
      return false;
    }

    // if (!validateEmail(formData.email)) {
    //   setError('Veuillez entrer un email valide');
    //   return false;
    // }

    // if (!validatePhone(formData.phone)) {
    //   setError('Veuillez entrer un numéro de téléphone valide');
    //   return false;
    // }

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return false;
    }

    if (formData.password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const result = await authAPI.register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password 
      });

      if (result.success) {
        navigate('/login?registered=true');
      } else {
        setError(result.error || "Échec de l'inscription");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'inscription';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={commonStyles.authContainer}>
      <video src={`${BASE}images/bees.mp4`} autoPlay loop playsInline className="background_signup"></video>
      <div className={styles.signupForm}>
        <div className={commonStyles.logo}>
          {/* <FaHoneyPot size={40} className={commonStyles.logoIcon} /> */}
          <h2>Miel en Ligne</h2>
          <p>Rejoignez notre communauté d'apiculteurs</p>
        </div>

        {error && (
          <div className={commonStyles.errorAlert}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className={commonStyles.formGroup}>
            <label htmlFor="name">
              {/* <FaUser className={commonStyles.inputIcon} />  */}
              Nom complet
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className={commonStyles.formGroup}>
            <label htmlFor="email">
              {/* <FaEnvelope className={commonStyles.inputIcon} /> */}
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className={commonStyles.formGroup}>
            <label htmlFor="phone">
              {/* <FaPhone className={commonStyles.inputIcon} /> */}
              Téléphone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              disabled={isLoading}
              pattern="[0-9]{9,15}"
              title="Numéro de téléphone (9 à 15 chiffres)"
            />
          </div>

          <div className={commonStyles.formGroup}>
            <label htmlFor="password">
              Mot de passe
            </label>
            <div className={commonStyles.passwordContainer}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
                disabled={isLoading}
                className={commonStyles.passwordInput}
              />
              <button
                type="button"
                className={commonStyles.togglePassword}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className={commonStyles.formGroup}>
            <label htmlFor="confirmPassword">
              Confirmer le mot de passe
            </label>
            <div className={commonStyles.passwordContainer}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={8}
                disabled={isLoading}
                className={commonStyles.passwordInput}
              />
              <button
                type="button"
                className={commonStyles.togglePassword}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={commonStyles.primarySignupButton}
            onSubmit={handleSubmit}
          >
            {isLoading ? 'Enregistrement en cours...' : 'S\'inscrire'}
          </button>
        </form>

        <div className={commonStyles.authLink}>
          <p>
            Vous avez déjà un compte?{' '}
            <Link to="/login" className={commonStyles.link}>
              Connectez-vous
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}




































// import React, { useState, useEffect } from 'react';
// //import { FaUser, FaLock, FaEnvelope, FaPhone, FaHoneyPot } from 'react-icons/fa';
// import { Link, useNavigate, useRouteError } from 'react-router-dom';
// import styles from '../../../styles/Signup.module.css';
// import commonStyles from '../../../styles/auth.module.css';
// //import  authAPI  from '../api/authAPI';
// import  {authAPI}  from '../../../api/authAPI';
// import { FaEye, FaEyeSlash } from 'react-icons/fa';


// interface FormData {
//   name: string;
//   email: string;
//   phone: string;
//   password: string;
//   confirmPassword: string;
// }

// export default function Signup() {
//   const [formData, setFormData] = useState<FormData>({
//     name: '',
//     email: '',
//     phone: '',
//     password: '',
//     confirmPassword: ''
//   });
//   const [error, setError] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const navigate = useNavigate();
//   const routeError = useRouteError();

//   useEffect(() => {
//     if (routeError) {
//       console.error('Route error in Signup:', routeError);
//       setError('Une erreur est survenue lors du chargement de la page');
//     }
//   }, [routeError]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const validateForm = (): boolean => {
//     if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
//       setError('Tous les champs sont obligatoires');
//       return false;
//     }

//     // if (!validateEmail(formData.email)) {
//     //   setError('Veuillez entrer un email valide');
//     //   return false;
//     // }

//     // if (!validatePhone(formData.phone)) {
//     //   setError('Veuillez entrer un numéro de téléphone valide');
//     //   return false;
//     // }

//     if (formData.password !== formData.confirmPassword) {
//       setError("Les mots de passe ne correspondent pas");
//       return false;
//     }

//     if (formData.password.length < 8) {
//       setError("Le mot de passe doit contenir au moins 8 caractères");
//       return false;
//     }

//     return true;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);

//     if (!validateForm()) return;

//     setIsLoading(true);
//     try {
//       const result = await authAPI.register({
//         name: formData.name,
//         email: formData.email,
//         phone: formData.phone,
//         password: formData.password 
//       });

//       if (result.success) {
//         navigate('/login?registered=true');
//       } else {
//         setError(result.error || "Échec de l'inscription");
//       }
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'inscription';
//       setError(errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className={commonStyles.authContainer}>
//       <video src="/images/bees.mp4" autoPlay loop playsInline className="background_signup"></video>
//       <div className={styles.signupForm}>
//         <div className={commonStyles.logo}>
//           {/* <FaHoneyPot size={40} className={commonStyles.logoIcon} /> */}
//           <h2>Miel en Ligne</h2>
//           <p>Rejoignez notre communauté d'apiculteurs</p>
//         </div>

//         {error && (
//           <div className={commonStyles.errorAlert}>
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} noValidate>
//           <div className={commonStyles.formGroup}>
//             <label htmlFor="name">
//               {/* <FaUser className={commonStyles.inputIcon} />  */}
//               Nom complet
//             </label>
//             <input
//               type="text"
//               id="name"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               required
//               disabled={isLoading}
//             />
//           </div>

//           <div className={commonStyles.formGroup}>
//             <label htmlFor="email">
//               {/* <FaEnvelope className={commonStyles.inputIcon} /> */}
//               Email
//             </label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//               disabled={isLoading}
//             />
//           </div>

//           <div className={commonStyles.formGroup}>
//             <label htmlFor="phone">
//               {/* <FaPhone className={commonStyles.inputIcon} /> */}
//               Téléphone
//             </label>
//             <input
//               type="tel"
//               id="phone"
//               name="phone"
//               value={formData.phone}
//               onChange={handleChange}
//               required
//               disabled={isLoading}
//               pattern="[0-9]{9,15}"
//               title="Numéro de téléphone (9 à 15 chiffres)"
//             />
//           </div>

//           <div className={commonStyles.formGroup}>
//             <label htmlFor="password">
//               Mot de passe
//             </label>
//             <div className={commonStyles.passwordContainer}>
//               <input
//                 type={showPassword ? "text" : "password"}
//                 id="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 required
//                 minLength={8}
//                 disabled={isLoading}
//                 className={commonStyles.passwordInput}
//               />
//               <button
//                 type="button"
//                 className={commonStyles.togglePassword}
//                 onClick={() => setShowPassword(!showPassword)}
//                 aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
//               >
//                 {showPassword ? <FaEyeSlash /> : <FaEye />}
//               </button>
//             </div>
//           </div>

//           <div className={commonStyles.formGroup}>
//             <label htmlFor="confirmPassword">
//               Confirmer le mot de passe
//             </label>
//             <div className={commonStyles.passwordContainer}>
//               <input
//                 type={showConfirmPassword ? "text" : "password"}
//                 id="confirmPassword"
//                 name="confirmPassword"
//                 value={formData.confirmPassword}
//                 onChange={handleChange}
//                 required
//                 minLength={8}
//                 disabled={isLoading}
//                 className={commonStyles.passwordInput}
//               />
//               <button
//                 type="button"
//                 className={commonStyles.togglePassword}
//                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                 aria-label={showConfirmPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
//               >
//                 {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
//               </button>
//             </div>
//           </div>

//           <button
//             type="submit"
//             disabled={isLoading}
//             className={commonStyles.primarySignupButton}
//             onSubmit={handleSubmit}
//           >
//             {isLoading ? 'Enregistrement en cours...' : 'S\'inscrire'}
//           </button>
//         </form>

//         <div className={commonStyles.authLink}>
//           <p>
//             Vous avez déjà un compte?{' '}
//             <Link to="/login" className={commonStyles.link}>
//               Connectez-vous
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }






