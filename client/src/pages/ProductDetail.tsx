// ProductDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById } from '../api/productService';
import { Product } from '../types';
import { addToCart } from '../api/cartAPI';
import { useAuth } from '../hooks/useAuth';
import '../styles/product-detail.css';



export const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedContainer, setSelectedContainer] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id!);
        setProduct(data);
        setSelectedContainer(data.contenants[0].type);
      } catch (err) {
        setError('Produit non trouvé');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      alert('Veuillez vous connecter pour ajouter au panier');
      return;
    }

    try {
      await addToCart({
        productId: product!._id,
        containerType: selectedContainer,
        quantity
      });
      alert('Produit ajouté au panier');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'ajout au panier');
    }
  };

  if (loading) return <div className="loading">Chargement...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!product) return <div className="error">Produit non trouvé</div>;

  return (
    <div className="product-detail-container">
      <div className="product-images">
        <img src={product.images[0]} alt={product.name} className="main-image" />
        <div className="thumbnail-container">
          {product.images.map((img, index) => (
            <img key={index} src={img} alt={`${product.name} ${index}`} className="thumbnail" />
          ))}
        </div>
      </div>
      
      <div className="product-info">
        <h1>{product.name}</h1>
        <p className="category">{product.category}</p>
        <p className="description">{product.description}</p>
        
        <div className="price-section">
          <h3>Options disponibles :</h3>
          <div className="container-options">
            {product.contenants.map((container) => (
              <div 
                key={container.type} 
                className={`container-option ${selectedContainer === container.type ? 'selected' : ''}`}
                onClick={() => setSelectedContainer(container.type)}
              >
                <span className="container-type">{container.type}</span>
                <span className="container-price">
                  {container.prixPromo ? (
                    <>
                      <span className="old-price">{container.prix}€</span>
                      <span className="promo-price">{container.prixPromo}€</span>
                    </>
                  ) : (
                    <span>{container.prix}€</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="quantity-selector">
          <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
          <span>{quantity}</span>
          <button onClick={() => setQuantity(quantity + 1)}>+</button>
        </div>

        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          Ajouter au panier
        </button>
      </div>
    </div>
  );
};