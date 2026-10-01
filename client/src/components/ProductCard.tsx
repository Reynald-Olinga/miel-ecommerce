import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import '../styles/products.css';
import { FiShoppingCart } from 'react-icons/fi'; 

type Contenant = Product['contenants'][number];

// 👇 Préfixe de base : '/' en dev, '/miel-ecommerce/' en build de production
const BASE = import.meta.env.BASE_URL;

interface ProductCardProps {
  product: Product;
  onAddRequest?: (product: Product) => void;
  onQuickAdd?: (product: Product, container: Contenant) => void;
}

const getBestPrice = (contenants: { prix: number; prixPromo?: number }[]) =>
  Math.min(...contenants.map(c => c.prixPromo || c.prix));

const getHoneyTypeLabel = (honeyType: string) => {
  const labels: Record<string, string> = {
    acacia: "Miel d'Acacia",
    lavender: 'Miel de Lavande',
    thyme: 'Miel de Thym',
    forest: 'Miel de Forêt',
    multifloral: 'Miel Multiflore',
    verveine: 'Miel de Verveine',
    falanga: 'Miel de Falanga',
    rayon: 'Miel en Rayon',
    orange: "Miel d'Orange",
    moringa: 'Miel de Moringa',
    cacao: 'Miel de Cacao',
    natural: 'Miel Naturel',
    cofee: 'Miel de Café',
    mountain: 'Miel de Montagne',
  };
  return labels[honeyType] || honeyType;
};

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddRequest,
  onQuickAdd,
}) => {
  const bestPrice = getBestPrice(product.contenants);
  const defaultContainer = product.contenants[0];

  return (
    <div className="product-card-new">
      <Link to={`/produit/${product._id}`} className="product-image-link">
        <img
          src={product.images[0]}
          alt={product.name}
          onError={(e) =>
            ((e.target as HTMLImageElement).src = `${BASE}images/placeholder-honey.jpg`)
          }
        />
      </Link>

      {/*  floating badge  */}
      <div className="price-badge"><FiShoppingCart size={24} color="#fff" /></div>

      <div className="product-meta">
        <h3>{product.name}</h3>
        <p className="honey-type">{'honeyType' in product ? getHoneyTypeLabel(String(product.honeyType)) : ''}</p>
        <p className="origin">{'origine' in product ? String(product.origine ?? '') : ''}</p>
      </div>

      {/*  slide-in cart layer  */}
      <div className="cart-overlay">
        <div className="cart">
          <span className="price"><FiShoppingCart size={24} color="#fff" /></span>

          <div className="add-to-cart">
            {onQuickAdd && defaultContainer && (
              <button
                className="txt quick"
                onClick={() => onQuickAdd(product, defaultContainer)}
              >
                Ajouter
              </button>
            )}

            {onAddRequest && (
              <button className="txt options" onClick={() => onAddRequest(product)}>
                Voir les options
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;