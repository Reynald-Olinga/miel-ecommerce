import React, { useState } from 'react';
import api from '../../../api/client';
import styles from '../../../styles/forgotPassword.module.css'; // ← styles avec un nom

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/auth/forgot-password', { email });
      setMessage('E-mail envoyé !');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur');
    }
  };

  return (
    <div className={styles.form_container}>
      <form onSubmit={handleSubmit} className={styles.forgot_form}>
        <h1 className={styles.forgot_title}>Mot de passe oublié</h1>
        {message && <p className={styles.success}>{message}</p>}
        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.forgot_container}>
          <input
            type="email"
            placeholder="Votre adresse e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.forgotPassword_input}
            required
          />
          
        </div>
        <button type="submit" className={styles.forgot_button}>
            Envoyer
        </button>
      </form>
    </div>
  );
}
















































// import React, { useState } from 'react';
// import api from '../../../api/client';
// import '../../../styles/forgotPassword.module.css';

// export default function ForgotPassword() {
//   const [email, setEmail] = useState('');
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       await api.post('/auth/forgot-password', { email });
//       setMessage('E-mail envoyé !');
//     } catch (err: any) {
//       setError(err.response?.data?.message || 'Erreur');
//     }
//   };

//   return (
//     <div className="form_container">
//       <form onSubmit={handleSubmit} className="forgot_form">
//         <h1 className="forgot_title">Mot de passe oublié</h1>
//         {message && <p className="text-green-600">{message}</p>}
//         {error && <p className="text-red-600">{error}</p>}
//         <div className="forgot_container">
//           <input
//             type="email"
//             placeholder="Votre adresse e-mail"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="forgotPassword_input"
//             required
//           />
//           <button className="forgot_button">Envoyer</button>
//         </div>
        
//       </form>
//     </div>
    
//   );
// }



