import express from 'express';
const app = express();
app.get('/', (req, res) => res.send('Test OK'));
app.listen(5000, () => console.log('Test sur 5000'));


import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; // Suppose que le serveur est déjà lancé

async function runTests() {
  try {
    // Test 1: Récupération des produits
    console.log("Test 1: Fetching products...");
    const productsRes = await axios.get(`${API_BASE_URL}/products`);
    console.log(`✓ Success! Found ${productsRes.data.length} products`);

    // Test 2: Création d'un produit test (optionnel)
    console.log("\nTest 2: Creating test product...");
    const testProduct = {
      name: "Miel de test",
      price: 9.99,
      description: "Produit de test"
    };
    
    const createRes = await axios.post(`${API_BASE_URL}/products`, testProduct);
    console.log(`✓ Product created with ID: ${createRes.data._id}`);

    // Nettoyage: Suppression du produit test (optionnel)
    console.log("\nCleaning up...");
    await axios.delete(`${API_BASE_URL}/products/${createRes.data._id}`);
    console.log("✓ Test product deleted");

    console.log("\n✅ All tests passed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Test failed:");
    if (error.response) {
      console.log("Status:", error.response.status);
      console.log("Response:", error.response.data);
    } else {
      console.log(error.message);
    }
    process.exit(1);
  }
}

runTests();