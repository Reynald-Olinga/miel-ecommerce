// src/pages/Boutique.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../api/productService';
import { Product, Contenant } from '../types';
import { useCart } from '../hooks/UseCart'; // ✅ Correction du chemin
import ProductCard from '../components/ProductCard';
import ContainerCarouselModal from '../components/ContainerCarouselModal';
import '../styles/products.css';

export const Boutique = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const { add, cart } = useCart(); // ✅ Ajout de cart pour accès direct

  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const openCarousel = (p: Product) => setModalProduct(p);
  const closeCarousel = () => setModalProduct(null);

  // ✅ Nouvelle fonction pour ajouter DIRECTEMENT via le hook
  const handleAddToCart = async (product: Product, container: Contenant) => {
    try {
      await add(product._id, container.type, 1);
      alert(`${product.name} (${container.type}) ajouté au panier !`);
    } catch (error) {
      console.error('Erreur ajout:', error);
      alert('Erreur lors de l\'ajout au panier');
    }
  };

  return (
    <div className="boutique-container">
      <h1 className="heading-secondary">Nos Miels</h1>
      <input
        type="text"
        placeholder="Rechercher un miel…"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="search-bar"
      />

      {/* ✅ Badge du panier */}
      <div className="cart-badge">
        <Link to="/panier" className="btn-cart">
          Voir mon panier 
          {cart?.items?.length > 0 && (
            <span className="cart-count">({cart.items.length})</span>
          )}
        </Link>
      </div>

      <div className="product-grid">
        {filtered.map(p => (
          <ProductCard
            key={p._id}
            product={p}
            onAddRequest={openCarousel} 
            onQuickAdd={handleAddToCart} 
          />
        ))}
      </div>

      {modalProduct && (
        <ContainerCarouselModal
          product={modalProduct}
          onClose={closeCarousel}
          onAdd={handleAddToCart} // ✅ Utilise directement handleAddToCart
        />
      )}
    </div>
  );
};

export default Boutique;









