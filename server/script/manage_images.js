import { v2 as cloudinary } from 'cloudinary';
import { readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: "dqkptrgan",
  api_key: "511148353915588",
  api_secret: "uGXTsRwb_tqTGaZdOwTHmERJ8Bo",
  secure: true,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const imagesDir = join(__dirname, '..', 'images');

const images = readdirSync(imagesDir).filter(f => /\.(jpg|jpeg|png)$/i.test(f));

const uploadAll = async () => {
  const mapping = {};

  for (const file of images) {
    const path = join(imagesDir, file);
    const publicId = file.replace(/\.\w+$/, ''); // miel-acacia

    try {
      const result = await cloudinary.uploader.upload(path, {
        folder: 'miel-ecommerce',
        public_id: publicId,
        overwrite: true,
        resource_type: 'image',
      });

      const optimizedUrl = cloudinary.url(result.public_id, {
        fetch_format: 'auto',
        quality: 'auto',
        width: 800,
        height: 800,
        crop: 'auto',
        gravity: 'auto',
      });

      mapping[file] = optimizedUrl;
      console.log(`✅ ${file} → ${optimizedUrl}`);
    } catch (err) {
      console.error(`❌ Erreur ${file}`, err.message);
    }
  }

  console.log('\n📦 Mapping complet :');
  console.log(JSON.stringify(mapping, null, 2));
  process.exit(0);
};

uploadAll();

















// import {v2 as cloudinary} from 'cloudinary';
// import dotenv from 'dotenv';

// cloudinary.config({
//     cloud_name: "dqkptrgan",
//     secure: true,
//     api_key: "511148353915588",
//     api_secret: "uGXTsRwb_tqTGaZdOwTHmERJ8Bo"
// });


// ( async function() {
//     const result = await cloudinary.uploader.upload('../images/miel_verveine.jpeg')
//     console.log(result);
//     const url_image = cloudinary.url('miel_verveine_jygb1e', 
//     {
//         transformation: [
//             {
//                 fetch_format: 'auto',
//                 quality: 'auto',
//             },
//             {
//                 width: 800,
//                 height: 800,
//                 crop: 'fill',
//                 gravity: 'auto',
//             }
//         ]
//     }
// )
// console.log(url_image);

    
// })();


