import makeWASocket, { 
  DisconnectReason, 
  fetchLatestBaileysVersion, 
  useMultiFileAuthState, 
} from '@whiskeysockets/baileys'; 
import pino from 'pino'; 
import { rm } from 'fs/promises';
 
let sock = null; 
let waReady = false; 
let starting = false; 
 
// ⚠️ OBLIGATOIRE POUR LE PREMIER DÉMARRAGE ⚠️ 
// Numéro WhatsApp du magasin, format international SANS '+' ni espaces. 
// Ex. Cameroun : 2376XXXXXXXX 
// Recommandé : mettre la variable dans server/.env au lieu de modifier ici : 
//   WA_PHONE_NUMBER=2376XXXXXXXX 
const PHONE_NUMBER = process.env.WA_PHONE_NUMBER || ''; 
 
// Dossier où Baileys sauvegarde la session (ne pas supprimer après appairage) 
const AUTH_FOLDER = './wa_auth'; 
 
export const initWA = async () => { 
  if (starting) return sock; 
  starting = true; 
 
  // Lu ici (et non en haut du fichier) pour être sûr que dotenv 
  // a déjà chargé le .env quand on lit cette variable. 
  const PHONE_NUMBER = process.env.WA_PHONE_NUMBER || ''; 
 
  try { 
    console.log('🔄 Initialisation de WhatsApp (Baileys)...'); 
 
    const { state, saveCreds } = await useMultiFileAuthState(AUTH_FOLDER); 
 
    // Récupère la version actuelle de WhatsApp Web (évite les erreurs 
    // de compatibilité). En cas d'échec, on utilise celle de Baileys. 
    let version; 
    try { 
      ({ version } = await fetchLatestBaileysVersion()); 
    } catch { 
      version = undefined; 
    } 
 
    sock = makeWASocket({ 
      ...(version ? { version } : {}), 
      auth: state, 
      logger: pino({ level: 'silent' }), 
      printQRInTerminal: false, 
      browser: ['Miel eCommerce', 'Chrome', '1.0.0'], 
      markOnlineOnConnect: false, 
      syncFullHistory: false, 
    }); 
 
    // Sauvegarde automatique des identifiants de session 
    sock.ev.on('creds.update', saveCreds); 
 
    // --- PREMIER DÉMARRAGE : demande du code d'appairage --- 
    // (uniquement si aucune session enregistrée dans wa_auth/) 
    if (!state.creds.registered && PHONE_NUMBER) { 
      setTimeout(async () => { 
        try { 
          // Laisse le temps au socket de se connecter 
          await new Promise((r) => setTimeout(r, 3000)); 
          const code = await sock.requestPairingCode(PHONE_NUMBER); 
 
          console.log('\n=========================================='); 
          console.log(`  CODE D'APPAIRAGE : ${code}`); 
          console.log('=========================================='); 
          console.log( 
            "  Dans WhatsApp (sur le téléphone de CE numéro) :\n" + 
              '  Paramètres → Appareils connectés → Connecter un appareil\n' + 
              '  → « Se connecter avec le numéro de téléphone »\n' + 
              '  → saisis le code ci-dessus (valide ~1 minute).\n' 
          ); 
        } catch (err) { 
          console.error( 
            '❌ Impossible de générer le code :', 
            err.message 
          ); 
        } 
      }, 1500); 
    } else if (!state.creds.registered) { 
      console.log( 
        "⚠️  Premier démarrage : configure WA_PHONE_NUMBER dans ton .env\n" + 
          '    (format international sans +, ex: 2376XXXXXXXX) puis relance.' 
      ); 
    } else { 
      console.log('📱 Session existante trouvée, reconnexion en cours...'); 
    } 
 
    // --- Suivi de la connexion --- 
    sock.ev.on('connection.update', (update) => { 
      const { connection, lastDisconnect } = update; 
 
      if (connection === 'open') { 
        waReady = true; 
        console.log('✅ WhatsApp connecté et prêt'); 
      } 
 
      if (connection === 'close') { 
        waReady = false; 
        const statusCode = lastDisconnect?.error?.output?.statusCode; 
        const loggedOut = statusCode === DisconnectReason.loggedOut; 
 
        if (loggedOut) { 
          console.error('❌ Session WhatsApp invalide, réinitialisation automatique...'); 
 
          rm(AUTH_FOLDER, { recursive: true, force: true }) 
            .then(() => { 
              console.log('🗑️ Dossier wa_auth supprimé avec succès.'); 
 
              setTimeout(() => { 
                starting = false; 
                initWA(); // générera un NOUVEAU code 
              }, 3000); 
            }) 
            .catch((error) => { 
              console.error( 
                '❌ Impossible de supprimer le dossier wa_auth :', 
                error.message 
              ); 
 
              setTimeout(() => { 
                starting = false; 
                initWA(); 
              }, 3000); 
            }); 
 
          return; 
        } 
 
        console.log('⚠️  WhatsApp déconnecté, reconnexion dans 5 s...'); 
        setTimeout(() => { 
          starting = false; 
          initWA(); 
        }, 5000); 
      } 
    }); 
 
    starting = false; 
    return sock; 
  } catch (error) { 
    starting = false; 
    console.error( 
      '❌ Erreur lors de l’initialisation de WhatsApp :', 
      error.message 
    ); 
    sock = null; 
    // WhatsApp ne doit pas empêcher le démarrage de l'API e-commerce. 
    return null; 
  } 
}; 
 
export const sendText = async (to, text) => { 
  if (!sock || !waReady) { 
    throw new Error( 
      'WhatsApp non initialisé. Vérifiez que initWA() a réussi.' 
    ); 
  } 
 
  if (!to || !text) { 
    throw new Error( 
      'Le numéro WhatsApp et le message sont obligatoires.' 
    ); 
 
  } 
 
  // Nettoyage du numéro : 
  // +237 6XX XX XX XX 
  // devient : 
  // 2376XXXXXXXX 
  const cleanNumber = String(to).replace(/[\s+\-()]/g, ''); 
 
  // ⚠️ ATTENTION : Baileys utilise @s.whatsapp.net 
  // (et NON @c.us comme wa-automate) 
  const jid = `${cleanNumber}@s.whatsapp.net`; 
 
  return sock.sendMessage(jid, { text }); 
}; 




























// import makeWASocket, {
//   DisconnectReason,
//   fetchLatestBaileysVersion,
//   useMultiFileAuthState,
// } from '@whiskeysockets/baileys';
// import pino from 'pino';

// let sock = null;
// let waReady = false;
// let starting = false;

// // ⚠️ OBLIGATOIRE POUR LE PREMIER DÉMARRAGE ⚠️
// // Numéro WhatsApp du magasin, format international SANS '+' ni espaces.
// // Ex. Cameroun : 2376XXXXXXXX
// // Recommandé : mettre la variable dans server/.env au lieu de modifier ici :
// //   WA_PHONE_NUMBER=2376XXXXXXXX
// const PHONE_NUMBER = process.env.WA_PHONE_NUMBER || '';

// // Dossier où Baileys sauvegarde la session (ne pas supprimer après appairage)
// const AUTH_FOLDER = './wa_auth';

// export const initWA = async () => {
//   if (starting) return sock;
//   starting = true;

//   // Lu ici (et non en haut du fichier) pour être sûr que dotenv
//   // a déjà chargé le .env quand on lit cette variable.
//   const PHONE_NUMBER = process.env.WA_PHONE_NUMBER || '';

//   try {
//     console.log('🔄 Initialisation de WhatsApp (Baileys)...');

//     const { state, saveCreds } = await useMultiFileAuthState(AUTH_FOLDER);

//     // Récupère la version actuelle de WhatsApp Web (évite les erreurs
//     // de compatibilité). En cas d'échec, on utilise celle de Baileys.
//     let version;
//     try {
//       ({ version } = await fetchLatestBaileysVersion());
//     } catch {
//       version = undefined;
//     }

//     sock = makeWASocket({
//       ...(version ? { version } : {}),
//       auth: state,
//       logger: pino({ level: 'silent' }),
//       printQRInTerminal: false,
//       browser: ['Miel eCommerce', 'Chrome', '1.0.0'],
//       markOnlineOnConnect: false,
//       syncFullHistory: false,
//     });

//     // Sauvegarde automatique des identifiants de session
//     sock.ev.on('creds.update', saveCreds);

//     // --- PREMIER DÉMARRAGE : demande du code d'appairage ---
//     // (uniquement si aucune session enregistrée dans wa_auth/)
//     if (!state.creds.registered && PHONE_NUMBER) {
//       setTimeout(async () => {
//         try {
//           // Laisse le temps au socket de se connecter
//           await new Promise((r) => setTimeout(r, 3000));
//           const code = await sock.requestPairingCode(PHONE_NUMBER);

//           console.log('\n==========================================');
//           console.log(`  CODE D'APPAIRAGE : ${code}`);
//           console.log('==========================================');
//           console.log(
//             "  Dans WhatsApp (sur le téléphone de CE numéro) :\n" +
//               '  Paramètres → Appareils connectés → Connecter un appareil\n' +
//               '  → « Se connecter avec le numéro de téléphone »\n' +
//               '  → saisis le code ci-dessus (valide ~1 minute).\n'
//           );
//         } catch (err) {
//           console.error(
//             '❌ Impossible de générer le code :',
//             err.message
//           );
//         }
//       }, 1500);
//     } else if (!state.creds.registered) {
//       console.log(
//         "⚠️  Premier démarrage : configure WA_PHONE_NUMBER dans ton .env\n" +
//           '    (format international sans +, ex: 2376XXXXXXXX) puis relance.'
//       );
//     } else {
//       console.log('📱 Session existante trouvée, reconnexion en cours...');
//     }

//     // --- Suivi de la connexion ---
//     sock.ev.on('connection.update', (update) => {
//       const { connection, lastDisconnect } = update;

//       if (connection === 'open') {
//         waReady = true;
//         console.log('✅ WhatsApp connecté et prêt');
//       }

//       if (connection === 'close') {
//         waReady = false;
//         const statusCode = lastDisconnect?.error?.output?.statusCode;
//         const loggedOut = statusCode === DisconnectReason.loggedOut;

//         if (loggedOut) {
//           console.error(
//             '❌ Session WhatsApp invalide. Supprime le dossier wa_auth/ ' +
//               'et relance le serveur pour réappairer.'
//           );
//           return;
//         }

//         console.log('⚠️  WhatsApp déconnecté, reconnexion dans 5 s...');
//         setTimeout(() => {
//           starting = false;
//           initWA();
//         }, 5000);
//       }
//     });

//     starting = false;
//     return sock;
//   } catch (error) {
//     starting = false;
//     console.error(
//       '❌ Erreur lors de l’initialisation de WhatsApp :',
//       error.message
//     );
//     sock = null;
//     // WhatsApp ne doit pas empêcher le démarrage de l'API e-commerce.
//     return null;
//   }
// };

// export const sendText = async (to, text) => {
//   if (!sock || !waReady) {
//     throw new Error(
//       'WhatsApp non initialisé. Vérifiez que initWA() a réussi.'
//     );
//   }

//   if (!to || !text) {
//     throw new Error(
//       'Le numéro WhatsApp et le message sont obligatoires.'
//     );
//   }

//   // Nettoyage du numéro :
//   // +237 6XX XX XX XX
//   // devient :
//   // 2376XXXXXXXX
//   const cleanNumber = String(to).replace(/[\s+\-()]/g, '');

//   // ⚠️ ATTENTION : Baileys utilise @s.whatsapp.net
//   // (et NON @c.us comme wa-automate)
//   const jid = `${cleanNumber}@s.whatsapp.net`;

//   return sock.sendMessage(jid, { text });
// };

















