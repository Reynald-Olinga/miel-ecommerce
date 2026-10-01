import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const addAdminWarren = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI non défini dans .env');
    }

    console.log('Connexion à MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI);
    
    console.log('✅ Connecté à MongoDB Atlas');

    const adminData = {
      firstName: "Warren",
      lastName: "Kegne",
      email: "warrenkegne@gmail.com",
      password: bcrypt.hashSync("HoneyAdmin2025", 10),
      role: "admin",
      isVerified: true
    };

    const result = await User.findOneAndUpdate(
      { email: adminData.email },
      adminData,
      { upsert: true, new: true }
    );
    
    console.log("✅ Administrateur Warren créé/mis à jour:", result.email);
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur:", error.message);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

addAdminWarren();