import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import basicAuth from 'express-basic-auth'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { readdirSync } from 'fs'

import productRoutes from './routes/products.js'
import orderRoutes from './routes/orders.js'
import cartRoutes from './routes/cartRoutes.js'
import authRoutes from './routes/authRoutes.js'
import { connectDB } from './config/db.js'
import { initWA } from './utils/whatsappClient.js'

// Charger les variables d'environnement
dotenv.config()

const PORT = process.env.PORT || 5000

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Détection des erreurs non catchées
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION:', err)
})

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err)
})

// Configuration Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Miel eCommerce',
      version: '1.0.0',
      description: 'Documentation de l\'API pour la boutique de miel'
    },
    servers: [
      { url: 'http://localhost:5000', description: 'Serveur de développement' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./routes/*.js', './controllers/*.js']
}

const swaggerSpec = swaggerJSDoc(swaggerOptions)

// Initialisation de l'application
const app = express()
mongoose.set('debug', true)

// 👇 CORS : UNE SEULE configuration — dev (5173) + preview (4173)
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:4173'
  ],
  credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

// Documentation Swagger (protégée par mot de passe)
app.use(
  '/api-docs',
  basicAuth({
    users: {
      [process.env.SWAGGER_USER || 'admin']:
      process.env.SWAGGER_PASSWORD || 'password'
    },
    challenge: true
  }),
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
)

app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.send(swaggerSpec)
})

// Fichiers statiques : images
const imagesPath = join(__dirname, 'images')
console.log('📁 Chemin des images:', imagesPath)
app.use('/images', express.static(imagesPath))

try {
  readdirSync(imagesPath)
} catch {
  console.log('📂 Le dossier images sera créé automatiquement si besoin')
}

// Routes API
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/auth', authRoutes)

// Routes de test
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'API Miel eCommerce is running',
    version: '1.0.0',
    docs: `http://localhost:${PORT}/api-docs`
  })
})

app.get('/api/test', (req, res) => {
  console.log('Test route called')
  res.json({ message: 'Test réussi' })
})

app.get('/test-images', (req, res) => {
  try {
    const files = readdirSync(imagesPath)
    const imageFiles = files.filter(f =>
      ['.jpg', '.jpeg', '.png', '.gif', '.webp'].some(ext => f.toLowerCase().endsWith(ext))
    )

    res.json({
      success: true,
      imagesPath,
      files: imageFiles,
      testUrl: `http://localhost:${PORT}/images/${imageFiles[0] || ''}`
    })
  } catch (error) {
    res.json({
      success: false,
      error: error.message,
      imagesPath
    })
  }
})

// Gestion des erreurs (DOIT être en dernier)
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Erreur serveur !')
})

// 👇 Connexion MongoDB : UNE SEULE fois
connectDB().then(() => {
  // WhatsApp ne doit pas empêcher le démarrage de l'API
  initWA().catch(err => console.error('❌ WhatsApp init error:', err.message))
})

// 👇 Démarrage du serveur : UNE SEULE fois
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server backend sur http://localhost:${PORT}`)
})

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    const newPort = Number(PORT) + 1
    console.log(`⚠️  Port ${PORT} occupé, tentative sur le port ${newPort}`)
    app.listen(newPort, '0.0.0.0', () => {
      console.log(`✅ Server backend sur http://localhost:${newPort}`)
    })
  } else {
    console.error('❌ Erreur serveur:', err)
  }
})




































// import express from 'express'
// import mongoose from 'mongoose'
// import dotenv from 'dotenv'
// import cors from 'cors'
// import products from './routes/products.js'
// import orders from './routes/orders.js'
// import { connectDB } from './config/db.js'; 
// import { createProduct } from './controllers/productController.js';; 
// import { getProducts } from './controllers/productController.js'; 
// import { createOrder } from './controllers/orderController.js';
// import productRoutes from './routes/products.js';
// import orderRoutes from './routes/orders.js'; 
// import cartRoutes from './routes/cartRoutes.js';
// import morgan from 'morgan';
// import authRoutes from './routes/authRoutes.js';
// import swaggerJSDoc from 'swagger-jsdoc';
// import swaggerUi from 'swagger-ui-express';
// import basicAuth from 'express-basic-auth';
// import { fileURLToPath } from 'url';
// import { dirname, join } from 'path';
// import { readFileSync, readdirSync } from 'fs';
// import { initWA } from './utils/whatsappClient.js';



// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// // [...] Après vos imports existants

// // Configuration Swagger
// const swaggerOptions = {
//   definition: {
//     openapi: '3.0.0',
//     info: {
//       title: 'API Miel eCommerce',
//       version: '1.0.0',
//       description: 'Documentation de l\'API pour la boutique de miel'
//     },
//     servers: [
//       { url: 'http://localhost:5000', description: 'Serveur de développement' }
//     ],
//     components: {
//       securitySchemes: {
//         bearerAuth: {
//           type: 'http',
//           scheme: 'bearer',
//           bearerFormat: 'JWT'
//         }
//       }
//     }
//   },
//   apis: ['./routes/*.js', './controllers/*.js'] // Fichiers à analyser
// };

// const swaggerSpec = swaggerJSDoc(swaggerOptions);




// // Ajoutez ceci en haut du fichier pour détecter les erreurs non catchées
// process.on('unhandledRejection', (err) => {
//   console.error('UNHANDLED REJECTION:', err);
// });

// process.on('uncaughtException', (err) => {
//   console.error('UNCAUGHT EXCEPTION:', err);
// });
// //import sendWhatsAppNotification from './utils/whatsapp.js'; // Importer la fonction d'envoi de notification WhatsApp



// // Load the variables environnement
// dotenv.config();

// // Initialize l'application
// const app = express();

// // Middlewares
// app.use(cors(
//   {
//     origin: 'http://localhost:5173', // Remplacez par l'URL de votre client
//     credentials: true // Si vous utilisez des cookies/sessions
//   }
// ));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// mongoose.set('debug', true);

// app.use('/api/auth', authRoutes); // Toutes les routes commencent par /api/auth

// // Middleware CORS
// app.use(cors({
//   origin: 'http://localhost:5173', // Remplacez par l'URL de votre client
//   credentials: true // Si vous utilisez des cookies/sessions
// }));
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// // 📍 Remplacez la partie "Servir les fichiers statiques" 
// // Configuration des fichiers statiques
// const imagesPath = join(__dirname, 'images');
// console.log('📁 Chemin des images:', imagesPath);

// // Servir les images
// app.use('/images', express.static(imagesPath));

// // Créer le dossier images s'il n'existe pas
// try {
//   readdirSync(imagesPath);
// } catch (error) {
//   console.log('📂 Création du dossier images...');
//   // mkdirSync(imagesPath, { recursive: true });
// }




// // Route protégée pour la documentation UI
// app.use(
//   '/api-docs',
//   basicAuth({
//     users: { 
//       [process.env.SWAGGER_USER || 'admin']: 
//       process.env.SWAGGER_PASSWORD || 'password' 
//     },
//     challenge: true
//   }),
//   swaggerUi.serve,
//   swaggerUi.setup(swaggerSpec)
// );

// // Route publique pour le fichier JSON (si nécessaire)
// app.get('/api-docs.json', (req, res) => {
//   res.setHeader('Content-Type', 'application/json');
//   res.send(swaggerSpec);
// });


// // Route racine de test
// app.get('/', (req, res) => {
//   res.json({ 
//     status: 'success',
//     message: 'API Miel eCommerce is running',
//     version: '1.0.0',
//     docs: 'http://localhost:5000/api-docs' // Si vous avez Swagger
//   });
// });

// // 📍 Ajoutez cette route de test pour vérifier les images
// // 📍 Route de test pour les images (après la configuration des fichiers statiques)
// app.get('/test-images', (req, res) => {
//   try {
//     const files = readdirSync(imagesPath);
//     const imageFiles = files.filter(f => 
//       ['.jpg', '.jpeg', '.png', '.gif', '.webp'].some(ext => f.toLowerCase().endsWith(ext))
//     );
    
//     res.json({ 
//       success: true,
//       imagesPath,
//       files: imageFiles,
//       testUrl: `http://localhost:${PORT}/images/${imageFiles[0] || ''}`
//     });
//   } catch (error) {
//     res.json({ 
//       success: false, 
//       error: error.message,
//       imagesPath 
//     });
//   }
// });


// // Activation des log complete


// // Ajoutez ceci avant les routes
// app.use(morgan('dev'));  // Logs of request HTTP
// app.use(express.json()); // Pour voir le corps des request

// // Connection to the database
// connectDB();

// connectDB().then(() => {
//   initWA().catch(err => console.error('❌ WhatsApp init error:', err.message));
// });

// // Routes

// //Routes test avant les autres routes 

// app.get('/api/test', (req, res) => {
//   console.log('Test route called'); // Vérifiez dans les logs
//   res.json({ message: 'Test réussi' });
// });

// // IMPORTANT : AFIN QUE LE WE GIVE LE CHEMIN CORRECT J'AI AJOUTÉ /API AUX CHEMINX PRECEDENTS

// app.use('/api/products', productRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/cart', cartRoutes);
// app.use('/api/auth', authRoutes);


// // Gestion des erreurs DOIT venir en dernier
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send('Erreur serveur !');
// });

// //Lancer le server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`✅ Server backend start sur http://localhost:${PORT}`);
// });




// // Connection MongoDB
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log('✅ Connected to MongoDB'))
//   .catch(err => console.error('❌ Error MongoDB:', err)); 

// // Start the server with error's management
// const server = app.listen(PORT, '0.0.0.0', () => {
//   console.log(`✅ Server backend started sur http://localhost:${PORT}`);
// });

// server.on('error', (err) => {
//   if (err.code === 'EADDRINUSE') {
//     console.log(`⚠️  Le port ${PORT} is occupied, tentative on the port ${Number(PORT)+1}`);
//     app.listen(Number(PORT)+1);
//   } else {
//     console.error('❌ Error server:', err);
//   }
// });
