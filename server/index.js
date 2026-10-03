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

// Charger les variables d'environnement
dotenv.config()

const PORT = process.env.PORT || 5000
const isProd = process.env.NODE_ENV === 'production'
const API_URL = process.env.API_URL || `http://localhost:${PORT}`

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
      {
        url: API_URL,
        description: isProd ? 'Serveur de production' : 'Serveur de développement'
      }
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

// Nécessaire derrière le proxy de Render (IP client, rate limit, cookies secure)
app.set('trust proxy', 1)

// Logs Mongoose détaillés uniquement en développement
mongoose.set('debug', !isProd)

// CORS : localhost (dev/preview) + URL du front en production
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  process.env.FRONTEND_URL,
  process.env.FRONT_URL
]
  .filter(Boolean)
  .map((url) => url.replace(/\/+$/, '')) // retire les "/" finaux éventuels

app.use(cors({
  origin: (origin, cb) => {
    // Pas d'origin (Postman, curl, requêtes serveur) ou origine autorisée
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true)
    // Préversions Cloudflare Pages (xxxx.miel-ecommerce.pages.dev)
    if (/^https:\/\/[a-z0-9-]+\.miel-ecommerce\.pages\.dev$/.test(origin)) {
      return cb(null, true)
    }
    return cb(new Error('Origine non autorisée par CORS'))
  },
  credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan(isProd ? 'combined' : 'dev'))

// Documentation Swagger (protégée par mot de passe)
const swaggerUser = process.env.SWAGGER_USER || 'admin'
const swaggerPassword = process.env.SWAGGER_PASSWORD || (isProd ? null : 'password')

if (swaggerPassword) {
  const swaggerAuth = basicAuth({
    users: { [swaggerUser]: swaggerPassword },
    challenge: true
  })

  app.use('/api-docs', swaggerAuth, swaggerUi.serve, swaggerUi.setup(swaggerSpec))

  app.get('/api-docs.json', swaggerAuth, (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerSpec)
  })
} else {
  console.warn('⚠️  SWAGGER_PASSWORD non défini : documentation Swagger désactivée en production')
}

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
    docs: `${API_URL}/api-docs`
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
      testUrl: `${API_URL}/images/${imageFiles[0] || ''}`
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

// Connexion MongoDB : une seule fois
connectDB().then(async () => {
  // WhatsApp : désactivé par défaut (activer avec ENABLE_WHATSAPP=true)
  // Import dynamique : le module n'est même pas chargé si la variable est absente
  if (process.env.ENABLE_WHATSAPP === 'true') {
    try {
      const { initWA } = await import('./utils/whatsappClient.js')
      await initWA()
    } catch (err) {
      console.error('❌ WhatsApp init error:', err.message)
    }
  } else {
    console.log('ℹ️  WhatsApp désactivé (ENABLE_WHATSAPP != true)')
  }
})

// Démarrage du serveur : une seule fois
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server backend sur le port ${PORT}`)
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
// import morgan from 'morgan'
// import swaggerJSDoc from 'swagger-jsdoc'
// import swaggerUi from 'swagger-ui-express'
// import basicAuth from 'express-basic-auth'
// import { fileURLToPath } from 'url'
// import { dirname, join } from 'path'
// import { readdirSync } from 'fs'

// import productRoutes from './routes/products.js'
// import orderRoutes from './routes/orders.js'
// import cartRoutes from './routes/cartRoutes.js'
// import authRoutes from './routes/authRoutes.js'
// import { connectDB } from './config/db.js'
// import { initWA } from './utils/whatsappClient.js'

// // Charger les variables d'environnement
// dotenv.config()

// const PORT = process.env.PORT || 5000

// const __filename = fileURLToPath(import.meta.url)
// const __dirname = dirname(__filename)

// // Détection des erreurs non catchées
// process.on('unhandledRejection', (err) => {
//   console.error('UNHANDLED REJECTION:', err)
// })

// process.on('uncaughtException', (err) => {
//   console.error('UNCAUGHT EXCEPTION:', err)
// })

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
//   apis: ['./routes/*.js', './controllers/*.js']
// }

// const swaggerSpec = swaggerJSDoc(swaggerOptions)

// // Initialisation de l'application
// const app = express()
// mongoose.set('debug', true)

// // 👇 CORS : UNE SEULE configuration — dev (5173) + preview (4173)
// app.use(cors({
//   origin: [
//     'http://localhost:5173',
//     'http://localhost:4173'
//   ],
//   credentials: true
// }))

// app.use(express.json())
// app.use(express.urlencoded({ extended: true }))
// app.use(morgan('dev'))

// // Documentation Swagger (protégée par mot de passe)
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
// )

// app.get('/api-docs.json', (req, res) => {
//   res.setHeader('Content-Type', 'application/json')
//   res.send(swaggerSpec)
// })

// // Fichiers statiques : images
// const imagesPath = join(__dirname, 'images')
// console.log('📁 Chemin des images:', imagesPath)
// app.use('/images', express.static(imagesPath))

// try {
//   readdirSync(imagesPath)
// } catch {
//   console.log('📂 Le dossier images sera créé automatiquement si besoin')
// }

// // Routes API
// app.use('/api/products', productRoutes)
// app.use('/api/orders', orderRoutes)
// app.use('/api/cart', cartRoutes)
// app.use('/api/auth', authRoutes)

// // Routes de test
// app.get('/', (req, res) => {
//   res.json({
//     status: 'success',
//     message: 'API Miel eCommerce is running',
//     version: '1.0.0',
//     docs: `http://localhost:${PORT}/api-docs`
//   })
// })

// app.get('/api/test', (req, res) => {
//   console.log('Test route called')
//   res.json({ message: 'Test réussi' })
// })

// app.get('/test-images', (req, res) => {
//   try {
//     const files = readdirSync(imagesPath)
//     const imageFiles = files.filter(f =>
//       ['.jpg', '.jpeg', '.png', '.gif', '.webp'].some(ext => f.toLowerCase().endsWith(ext))
//     )

//     res.json({
//       success: true,
//       imagesPath,
//       files: imageFiles,
//       testUrl: `http://localhost:${PORT}/images/${imageFiles[0] || ''}`
//     })
//   } catch (error) {
//     res.json({
//       success: false,
//       error: error.message,
//       imagesPath
//     })
//   }
// })

// // Gestion des erreurs (DOIT être en dernier)
// app.use((err, req, res, next) => {
//   console.error(err.stack)
//   res.status(500).send('Erreur serveur !')
// })

// // 👇 Connexion MongoDB : UNE SEULE fois
// connectDB().then(() => {
//   // WhatsApp ne doit pas empêcher le démarrage de l'API
//   initWA().catch(err => console.error('❌ WhatsApp init error:', err.message))
// })

// // 👇 Démarrage du serveur : UNE SEULE fois
// const server = app.listen(PORT, '0.0.0.0', () => {
//   console.log(`✅ Server backend sur http://localhost:${PORT}`)
// })

// server.on('error', (err) => {
//   if (err.code === 'EADDRINUSE') {
//     const newPort = Number(PORT) + 1
//     console.log(`⚠️  Port ${PORT} occupé, tentative sur le port ${newPort}`)
//     app.listen(newPort, '0.0.0.0', () => {
//       console.log(`✅ Server backend sur http://localhost:${newPort}`)
//     })
//   } else {
//     console.error('❌ Erreur serveur:', err)
//   }
// })

