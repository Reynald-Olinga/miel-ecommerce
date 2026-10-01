import mongoose from 'mongoose';
import Product from '../models/productModel.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

console.log('MONGO_URI =', process.env.MONGO_URI);

// Données complètes avec les nouveaux contenants
const products = [
  // Miels monofloraux
  {
    name: "Miel d'Acacia",
    category: "monofloral",
    honeyType: "acacia",
    description: "Miel liquide et clair au goût subtil et délicat. Parfait pour sucrer sans altérer les saveurs.",
    images: "https://res.cloudinary.com/dqkptrgan/image/upload/c_auto,f_auto,g_auto,h_800,q_auto,w_800/v1/miel-ecommerce/miel_acacia?_a=BAMAK+TG0",
    utilisation: "Dans les boissons chaudes ou froides",
    stock: 30,
    harvestDate: new Date("2024-05-10"),
    origine: "Cameroun region Adamaoua",
    contenants: [
      { type: "Pot verre 250g", prix: 3500, image_pot: "https://i.ibb.co/KcL1Bm35/miel-verveine.jpg" },
      { type: "Pot verre 500g", prix: 6200, image_pot: "https://i.ibb.co/KcL1Bm35/miel-verveine.jpg" },
      { type: "Pot verre 1kg", prix: 11000, image_pot: "https://i.ibb.co/KcL1Bm35/miel-verveine.jpg" },
      { type: "Bouteille 0.5L", prix: 6000, image_pot: "https://i.ibb.co/KcL1Bm35/miel-verveine.jpg" },
      { type: "Bouteille 1L", prix: 10500, image_pot: "https://i.ibb.co/KcL1Bm35/miel-verveine.jpg" },
      { type: "Bouteille 1.5L", prix: 15000, image_pot: "https://i.ibb.co/KcL1Bm35/miel-verveine.jpg" }
   ],
    prixBase: 3500
  },
  {
    name: "Miel de Montagne",
    category: "polyfloral",
    honeyType: "mountain",
    description: "Miel crémeux aux arômes floraux intenses, récolté en altitude. Texture onctueuse et saveur riche.",
    images: "https://res.cloudinary.com/dqkptrgan/image/upload/c_auto,f_auto,g_auto,h_800,q_auto,w_800/v1/miel-ecommerce/miel_blanc?_a=BAMAK+TG0",
    utilisation: "Idéal pour sucrer les infusions ou sur des tartines",
    stock: 25,
    harvestDate: new Date("2024-06-01"),
    origine: "Cameroun region Nord-Ouest",
    contenants: [
      { type: "Pot verre 250g", prix: 3500, image_pot: "https://i.ibb.co/KcL1Bm35/miel-verveine.jpg" },
      { type: "Pot verre 500g", prix: 6200, image_pot: "https://i.ibb.co/KcL1Bm35/miel-verveine.jpg" },
      { type: "Pot verre 1kg", prix: 11000, image_pot: "https://i.ibb.co/KcL1Bm35/miel-verveine.jpg" },
      { type: "Bouteille 0.5L", prix: 6000, image_pot: "https://i.ibb.co/KcL1Bm35/miel-verveine.jpg" },
      { type: "Bouteille 1L", prix: 10500, image_pot: "https://i.ibb.co/KcL1Bm35/miel-verveine.jpg" },
      { type: "Bouteille 1.5L", prix: 15000, image_pot: "https://i.ibb.co/KcL1Bm35/miel-verveine.jpg" }
   ],
    prixBase: 4000
  },
  {
    name: "Miel de Caféier",
    category: "monofloral",
    honeyType: "cofee",
    description: "Miel puissant aux arômes typiques du thym, récolté en Espagne. Propriétés antiseptiques reconnues.",
    images: "https://res.cloudinary.com/dqkptrgan/image/upload/c_auto,f_auto,g_auto,h_800,q_auto,w_800/v1/miel-ecommerce/miel_caf%C3%A9?_a=BAMAK+TG0",
    utilisation: "Pour les infections hivernales ou en cuisine méditerranéenne",
    stock: 18,
    harvestDate: new Date("2024-04-15"),
    origine: "Cameroun region Sud",
    contenants: [
      { type: "Pot verre 250g", prix: 3500, image_pot: "https://i.ibb.co/KcL1Bm35/miel-verveine.jpg" },
      { type: "Pot verre 500g", prix: 6200, image_pot: "https://i.ibb.co/KcL1Bm35/miel-verveine.jpg" },
      { type: "Pot verre 1kg", prix: 11000, image_pot: "https://i.ibb.co/KcL1Bm35/miel-verveine.jpg" },
      { type: "Bouteille 0.5L", prix: 6000, image_pot: "https://i.ibb.co/KcL1Bm35/miel-verveine.jpg" },
      { type: "Bouteille 1L", prix: 10500, image_pot: "https://i.ibb.co/KcL1Bm35/miel-verveine.jpg" },
      { type: "Bouteille 1.5L", prix: 15000, image_pot: "https://i.ibb.co/KcL1Bm35/miel-verveine.jpg" }
   ],
    prixBase: 4500
  },

  // Miels polyfloraux
  {
    name: "Miel Complément",
    category: "polyfloral",
    honeyType: "forest",
    description: "Miel multifloral des forêts d'Afrique centrale. Saveur boisée prononcée et couleur ambrée foncée.",
    images: "https://res.cloudinary.com/dqkptrgan/image/upload/c_auto,f_auto,g_auto,h_800,q_auto,w_800/v1/miel-ecommerce/miel_complement?_a=BAMAK+TG0",
    utilisation: "Pour pâtisseries ou marinades",
    stock: 12,
    harvestDate: new Date("2024-03-10"),
    origine: "Cameroun region Est",
    contenants: [
      { type: "Pot verre 250g", prix: 3500, image_pot: "https://i.ibb.co/KcL1Bm35/miel-verveine.jpg" },
      { type: "Pot verre 500g", prix: 6200, image_pot: "https://i.ibb.co/KcL1Bm35/miel-verveine.jpg" },
      { type: "Pot verre 1kg", prix: 11000, image_pot: "https://i.ibb.co/KcL1Bm35/miel-verveine.jpg" },
      { type: "Bouteille 0.5L", prix: 6000, image_pot: "https://i.ibb.co/KcL1Bm35/miel-verveine.jpg" },
      { type: "Bouteille 1L", prix: 10500, image_pot: "https://i.ibb.co/KcL1Bm35/miel-verveine.jpg" },
      { type: "Bouteille 1.5L", prix: 15000, image_pot: "https://i.ibb.co/KcL1Bm35/miel-verveine.jpg" }
   ],
    prixBase: 5800
  },
  {
    name: "Miel falanga",
    category: "monofloral",
    honeyType: "falanga",
    description: "Mélange de fleurs de printemps avec des notes fruitées. Récolte artisanale en Provence.",
    images: "https://res.cloudinary.com/dqkptrgan/image/upload/c_auto,f_auto,g_auto,h_800,q_auto,w_800/v1/miel-ecommerce/miel_falanga?_a=BAMAK+TG0",
    utilisation: "Sur fromages ou dans les yaourts",
    stock: 20,
    harvestDate: new Date("2024-05-20"),
    origine: "Cameroun region Ouest",
    contenants: [
      { type: "Pot verre 250g", prix: 3500, image_pot: "https://i.ibb.co/KcL1Bm35/miel-verveine.jpg" },
      { type: "Pot verre 500g", prix: 6200, image_pot: "https://i.ibb.co/KcL1Bm35/miel-verveine.jpg" },
      { type: "Pot verre 1kg", prix: 11000, image_pot: "https://i.ibb.co/KcL1Bm35/miel-verveine.jpg" },
      { type: "Bouteille 0.5L", prix: 6000, image_pot: "https://i.ibb.co/KcL1Bm35/miel-verveine.jpg" },
      { type: "Bouteille 1L", prix: 10500, image_pot: "https://i.ibb.co/KcL1Bm35/miel-verveine.jpg" },
      { type: "Bouteille 1.5L", prix: 15000, image_pot: "https://i.ibb.co/KcL1Bm35/miel-verveine.jpg" }
   ],
    prixBase: 2800
  },

  // Coffrets et accessoires
  {
    name: "Miel Nature",
    category: "monofloral",
    honeyType: "natural",
    description: "Sélection de 4 miels monofloraux (acacia, lavande, thym, forêt) dans un coffret cadeau en bois.",
    images: "https://res.cloudinary.com/dqkptrgan/image/upload/c_auto,f_auto,g_auto,h_800,q_auto,w_800/v1/miel-ecommerce/miel_nature?_a=BAMAK+TG0",
    utilisation: "Idéal pour offrir",
    stock: 8,
    harvestDate: new Date("2024-06-01"),
    origine: "Cameroun region Centre",
    contenants: [
      { type: "Pot verre 250g", prix: 3500, image_pot: "https://i.ibb.co/KcL1Bm35/miel-verveine.jpg" },
      { type: "Pot verre 500g", prix: 6200, image_pot: "https://i.ibb.co/KcL1Bm35/miel-verveine.jpg" },
      { type: "Pot verre 1kg", prix: 11000, image_pot: "https://i.ibb.co/KcL1Bm35/miel-verveine.jpg" },
      { type: "Bouteille 0.5L", prix: 6000, image_pot: "https://i.ibb.co/KcL1Bm35/miel-verveine.jpg" },
      { type: "Bouteille 1L", prix: 10500, image_pot: "https://i.ibb.co/KcL1Bm35/miel-verveine.jpg" },
      { type: "Bouteille 1.5L", prix: 15000, image_pot: "https://i.ibb.co/KcL1Bm35/miel-verveine.jpg" }
   ],
    prixBase: 15000
  },
  {
    name: "Miel Oranger",
    category: "monofloral",
    honeyType: "orange",
    description: "Miel doux et parfumé aux fleurs d'oranger. Idéal pour les desserts ou à déguster seul.",
    images: "https://res.cloudinary.com/dqkptrgan/image/upload/c_auto,f_auto,g_auto,h_800,q_auto,w_800/v1/miel-ecommerce/miel_oranger?_a=BAMAK+TG0",
    utilisation: "Sur crêpes ou dans les infusions",
    stock: 10,
    harvestDate: new Date("2024-04-20"),
    origine: "Cameroun region Littoral",
    contenants: [
      { type: "Pot verre 250g", prix: 3500, image_pot: "https://i.ibb.co/KcL1Bm35/miel-verveine.jpg" },
      { type: "Pot verre 500g", prix: 6200, image_pot: "https://i.ibb.co/KcL1Bm35/miel-verveine.jpg" },
      { type: "Pot verre 1kg", prix: 11000, image_pot: "https://i.ibb.co/KcL1Bm35/miel-verveine.jpg" },
      { type: "Bouteille 0.5L", prix: 6000, image_pot: "https://i.ibb.co/KcL1Bm35/miel-verveine.jpg" },
      { type: "Bouteille 1L", prix: 10500, image_pot: "https://i.ibb.co/KcL1Bm35/miel-verveine.jpg" },
      { type: "Bouteille 1.5L", prix: 15000, image_pot: "https://i.ibb.co/KcL1Bm35/miel-verveine.jpg" }
   ],
    prixBase: 3500
  },
  {
    name: "Miel Rayon",
    category: "monofloral",
    honeyType: "rayon",
    description: "Miel thérapeutique de Nouvelle-Zélande aux propriétés antibactériennes exceptionnelles.",
    images: "https://res.cloudinary.com/dqkptrgan/image/upload/c_auto,f_auto,g_auto,h_800,q_auto,w_800/v1/miel-ecommerce/miel_rayon?_a=BAMAK+TG0",
    utilisation: "Consommation quotidienne à petite dose",
    stock: 5,
    harvestDate: new Date("2024-02-15"),
    origine: "Cameroun region Nord-Ouest",
    contenants: [
      { type: "Pot verre 250g", prix: 3500, image_pot: "https://i.ibb.co/KcL1Bm35/miel-verveine.jpg" },
      { type: "Pot verre 500g", prix: 6200, image_pot: "https://i.ibb.co/KcL1Bm35/miel-verveine.jpg" },
      { type: "Pot verre 1kg", prix: 11000, image_pot: "https://i.ibb.co/KcL1Bm35/miel-verveine.jpg" },
      { type: "Bouteille 0.5L", prix: 6000, image_pot: "https://i.ibb.co/KcL1Bm35/miel-verveine.jpg" },
      { type: "Bouteille 1L", prix: 10500, image_pot: "https://i.ibb.co/KcL1Bm35/miel-verveine.jpg" },
      { type: "Bouteille 1.5L", prix: 15000, image_pot: "https://i.ibb.co/KcL1Bm35/miel-verveine.jpg" }
   ],
    prixBase: 12000
  },
  {
    name: "Miel Verveine",
    category: "monofloral",
    honeyType: "verveine",
    description: "Miel doux et parfumé aux fleurs de verveine. Idéal pour les desserts ou à déguster seul.",
    images: "https://res.cloudinary.com/dqkptrgan/image/upload/c_auto,f_auto,g_auto,h_800,q_auto,w_800/v1/miel-ecommerce/miel_verveine?_a=BAMAK+TG0",
    utilisation: "Consommation quotidienne à petite dose",
    stock: 5,
    harvestDate: new Date("2024-02-15"),
    origine: "Cameroun region Sud-Ouest",
    contenants: [
      { type: "Pot verre 250g", prix: 3500, image_pot: "https://i.ibb.co/KcL1Bm35/miel-verveine.jpg" },
      { type: "Pot verre 500g", prix: 6200, image_pot: "https://i.ibb.co/KcL1Bm35/miel-verveine.jpg" },
      { type: "Pot verre 1kg", prix: 11000, image_pot: "https://i.ibb.co/KcL1Bm35/miel-verveine.jpg" },
      { type: "Bouteille 0.5L", prix: 6000, image_pot: "https://i.ibb.co/KcL1Bm35/miel-verveine.jpg" },
      { type: "Bouteille 1L", prix: 10500, image_pot: "https://i.ibb.co/KcL1Bm35/miel-verveine.jpg" },
      { type: "Bouteille 1.5L", prix: 15000, image_pot: "https://i.ibb.co/KcL1Bm35/miel-verveine.jpg" }
   ],
    prixBase: 8000
  }


  

];


// Après vos imports existants

// Dans votre fonction seed(), ajoutez :



  //console.log(images);

const seedDB = async () => {
  try {
    console.log("🔗 Connexion à MongoDB Atlas...");
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log("✅ Connecté à la base :", mongoose.connection.db.databaseName);

    console.log("🧹 Nettoyage des anciennes données...");
    const { deletedCount } = await Product.deleteMany({});
    console.log(`🗑️ ${deletedCount} produits supprimés`);

    console.log("🌱 Insertion des nouveaux produits...");
    const docs = await Product.insertMany(products, { ordered: false });
    console.log(`✔️ ${docs.length} produits insérés avec succès`);

    const total = await Product.countDocuments();
    const sample = await Product.findOne().sort({ prixBase: -1 });
    
    console.log(`
    📊 Statistiques finales :
    ========================
    Total produits: ${total}
    Exemple de produit haut de gamme : ${sample.name} (à partir de ${sample.prixBase}XAF)
    Options disponibles : ${sample.contenants.map(c => `${c.type} - ${c.prix}XAF`).join(', ')}
    `);

    process.exit(0);
  } catch (err) {
    console.error('\n💥 ERREUR :', err.message);
    if (err.writeErrors) {
      console.error("Détail des erreurs :");
      err.writeErrors.forEach(e => console.log(e.errmsg));
    }
    process.exit(1);
  }

}
// Lancer le seed 

seedDB();



// {
//   "miel_acacia.jpeg": "https://res.cloudinary.com/dqkptrgan/image/upload/c_auto,f_auto,g_auto,h_800,q_auto,w_800/v1/miel-ecommerce/miel_acacia?_a=BAMAK+TG0",
//   "miel_blanc.jpeg": "https://res.cloudinary.com/dqkptrgan/image/upload/c_auto,f_auto,g_auto,h_800,q_auto,w_800/v1/miel-ecommerce/miel_blanc?_a=BAMAK+TG0",
//   "miel_café.jpeg": "https://res.cloudinary.com/dqkptrgan/image/upload/c_auto,f_auto,g_auto,h_800,q_auto,w_800/v1/miel-ecommerce/miel_caf%C3%A9?_a=BAMAK+TG0",
//   "miel_complement.jpeg": "https://res.cloudinary.com/dqkptrgan/image/upload/c_auto,f_auto,g_auto,h_800,q_auto,w_800/v1/miel-ecommerce/miel_complement?_a=BAMAK+TG0",
//   "miel_falanga.jpeg": "https://res.cloudinary.com/dqkptrgan/image/upload/c_auto,f_auto,g_auto,h_800,q_auto,w_800/v1/miel-ecommerce/miel_falanga?_a=BAMAK+TG0",
//   "miel_nature.jpeg": "https://res.cloudinary.com/dqkptrgan/image/upload/c_auto,f_auto,g_auto,h_800,q_auto,w_800/v1/miel-ecommerce/miel_nature?_a=BAMAK+TG0",
//   "miel_oranger.jpeg": "https://res.cloudinary.com/dqkptrgan/image/upload/c_auto,f_auto,g_auto,h_800,q_auto,w_800/v1/miel-ecommerce/miel_oranger?_a=BAMAK+TG0",
//   "miel_rayon.jpeg": "https://res.cloudinary.com/dqkptrgan/image/upload/c_auto,f_auto,g_auto,h_800,q_auto,w_800/v1/miel-ecommerce/miel_rayon?_a=BAMAK+TG0",
//   "miel_verveine.jpeg": "https://res.cloudinary.com/dqkptrgan/image/upload/c_auto,f_auto,g_auto,h_800,q_auto,w_800/v1/miel-ecommerce/miel_verveine?_a=BAMAK+TG0"
// }
// reynald@reynald-Inspiron-7537:~/Documents/programation/Projet MI_1/miel-ecommerce/miel-ecommerce/server/script$ 

// Actualisation de la base de données 
// mongosh "mongodb+srv://honey-admin:geETDV9kWWgS6LYA@cluster0.fgbltg8.mongodb.net/Project_HONEY?retryWrites=true&w=majority" --eval "db.products.deleteMany({}); db.orders.deleteMany({}); db.users.deleteMany({});"