import mongoose from 'mongoose';
import 'dotenv/config';
// const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/db';
// mongoose.connect(uri)
// .then(() => console.log('MongoDB connected'))
// .catch(err => console.error(err));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connecté à MongoDB. Base de données:', mongoose.connection.db.databaseName))
  .catch(err => console.error('❌ Erreur MongoDB:', err));


export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connection to MongoDB winning');
  } catch (error) {
    console.error('Error of connection MongoDB:', error.message);
    process.exit(1);
  }
};

export default mongoose;


