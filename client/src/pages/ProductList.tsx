import React, { useEffect, useState } from 'react';
import { getAllProducts } from '../api/productService'; // Importez la fonction spécifique
import { Product } from '../types';
import '../styles/products.css';
import { FiShoppingCart } from 'react-icons/fi'; 



const ProductList: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await ProductService.getAll();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) return <div className="loading-spinner">Chargement...</div>;
  if (error) return <div className="error-message">Erreur: {error}</div>;

  return (
    <div className="product-list">
            <h1>Nos produits</h1>
            <div className="products-grid">
                {products.map((product) => (
                    <div key={product._id} className="product-card">
                        <img 
                            src={product.image || '/placeholder-honey.jpg'} 
                            alt={product.name}
                            className="product-image"
                        />
                        <h3>{product.name}</h3>
                        <p className="price">{product.price.toFixed(2)} XAF</p>
                        <button className="view-button">Voir détails</button>
                    </div>
                ))}
            </div>
        </div>
  );
};

export default ProductList;