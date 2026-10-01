// ProductCart.tsx – fichier complet (à coller tel quel)
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchCart, updateItem, removeItem, createOrder } from '../api/cartAPI';
import '../styles/ProductCart.css';
import { validateOrderForm } from '../utils/validation';

type CartItem = {
  _id: string;
  product: {
    _id: string;
    name: string;
    images: string;
    contenants: Array<{
      type: string;
      prix: number;
      prixPromo?: number;
    }>;
  };
  containerType: string;
  quantity: number;
  price: number;
};

type CartData = {
  items: CartItem[];
  total: number;
};

const ProductCart = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    paymentMethod: 'Mobile Money' as const,
    message: '',
  });

  const [cart, setCart] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showMessage, setShowMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const { data } = await fetchCart();
      setCart(data);
    } catch {
      setError('Erreur de chargement du panier');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    try {
      setIsProcessing(true);
      await updateItem(itemId, newQuantity);
      await loadCart();
    } catch {
      setError('Erreur de mise à jour');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      setIsProcessing(true);
      await removeItem(itemId);
      await loadCart();
    } catch {
      setError('Erreur lors de la suppression');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowMessage(null);

    const { isValid, errors: validationErrors } = validateOrderForm(formData);
    setErrors(validationErrors);

    if (!isValid) {
      setShowMessage({ type: 'error', text: 'Veuillez corriger les erreurs du formulaire.' });
      return;
    }

    setIsProcessing(true);

    const orderItems = cart?.items.map((item) => ({
      product: item.product._id,
      containerType: item.containerType,
      quantity: item.quantity,
    })) ?? [];

    const payload = {
      items: orderItems,
      shippingAddress: {
        address: formData.address,
        city: formData.city,
        country: 'Cameroun',
      },
      paymentMethod: formData.paymentMethod,
      message: formData.message,
      customer: {
        name: formData.name,
        phone: formData.phone,
      },
      total: cart?.total ?? 0,
    };

    try {
      await createOrder(payload);
      setShowMessage({ type: 'success', text: 'Commande passée avec succès !' });
      setCart({ items: [], total: 0 });
      setFormData({
        name: '',
        phone: '',
        address: '',
        city: '',
        paymentMethod: 'Mobile Money',
        message: '',
      });
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Erreur inconnue';
      setShowMessage({ type: 'error', text: msg });
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return <div className="cart-loading">Chargement du panier...</div>;
  if (!cart || cart.items.length === 0) {
    return (
      <div className="cart-empty">
        <h2 className="heading-secondary">Votre panier est vide</h2>
        <Link to="/boutique" className="btn-cart empty">
          Retour à la boutique
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <nav className="breadcrumb-nav">
        <Link to="/" className="breadcrumb-link">Accueil</Link>
        <span> &gt; </span>
        <Link to="/boutique" className="breadcrumb-link">Boutique</Link>
        <span> &gt; </span>
        <span className="breadcrumb-current">Panier</span>
      </nav>

      {error && <div className="cart-error">{error}</div>}
      <h1 className="heading-secondary">Finaliser votre commande</h1>

      <div className="cart-layout">
        {/* Panier */}
        <div className="cart-items-container">
          <div className="cart-items-card">
            <h2>Votre panier</h2>
            {cart.items.map((item) => {
              const container = item.product.contenants.find((c) => c.type === item.containerType);
              const price = container?.prixPromo || container?.prix || 0;
              return (
                <div key={item._id} className="cart-item">
                  <Link to={`/product/${item.product._id}`} className="cart-item-link">
                    <img src={item.product.images} alt={item.product.name} className="cart-item-image" />
                  </Link>
                  <div className="cart-item-details">
                    <Link to={`/product/${item.product._id}`} className="cart-item-name">
                      <h3>{item.product.name}</h3>
                    </Link>
                    <p className="cart-item-type">{item.containerType}</p>
                    <p className="cart-item-price">{price.toLocaleString()} XAF</p>
                  </div>
                  <div className="cart-item-quantity">
                    <button onClick={() => handleUpdateQuantity(item._id, Math.max(1, item.quantity - 1))} disabled={isProcessing}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)} disabled={isProcessing}>+</button>
                  </div>
                  <button onClick={() => handleRemoveItem(item._id)} disabled={isProcessing} className="cart-item-remove">
                    Supprimer
                  </button>
                </div>
              );
            })}

            <div className="cart-total">
              <div className="cart-total-row">
                <span>Total</span>
                <span>{cart.total.toLocaleString()} XAF</span>
              </div>
            </div>

            <div className="cart-actions">
              <Link to="/boutique" className="btn-continue-shopping">
                Continuer mes achats
              </Link>
            </div>
          </div>
        </div>

        {/* Formulaire */}
        <div className="cart-form-container">
          <form onSubmit={handleSubmit} className="cart-form">
            <h2>Informations de livraison</h2>

            <div className="form-group">
              <label>Nom complet</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} required placeholder="Entrez votre nom complet" />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label>Numéro de téléphone</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required placeholder="Entrez votre numéro de téléphone" />
              {errors.phone && <span className="error-text">{errors.phone}</span>}
            </div>

            <div className="form-group">
              <label>Adresse</label>
              <input type="text" name="address" value={formData.address} onChange={handleInputChange} required placeholder="Entrez votre adresse" />
              {errors.address && <span className="error-text">{errors.address}</span>}
            </div>

            <div className="form-group">
              <label>Ville</label>
              <input type="text" name="city" value={formData.city} onChange={handleInputChange} required placeholder="Entrez votre ville" />
              {errors.city && <span className="error-text">{errors.city}</span>}
            </div>

            <div className="form-group">
              <label>Moyen de paiement</label>
              <select name="paymentMethod" value={formData.paymentMethod} onChange={handleInputChange} required title="Moyen de paiement">
                <option value="Mobile Money">Mobile Money</option>
                <option value="Orange Money">Orange Money</option>
                <option value="Carte Bancaire">Carte Bancaire</option>
                <option value="Espèces">Paiement en espèces</option>
              </select>
            </div>

            <div className="form-group">
              <label>Instructions spéciales (optionnel)</label>
              <textarea name="message" value={formData.message} onChange={handleInputChange} rows={3} placeholder="Ajoutez des instructions spéciales pour la livraison (optionnel)" />
            </div>

            <div className="order-summary">
              <h3>Récapitulatif de commande</h3>
              <div className="summary-row"><span>Sous-total</span><span>{cart.total.toLocaleString()} XAF</span></div>
              <div className="summary-row"><span>Livraison</span><span>Gratuite</span></div>
              <div className="summary-total"><span>Total</span><span>{cart.total.toLocaleString()} XAF</span></div>
            </div>

            {showMessage && (
              <div className={`message-banner ${showMessage.type}`}>
                {showMessage.text}
              </div>
            )}

            <button type="submit" disabled={isProcessing} className="btn-checkout">
              {isProcessing ? 'Traitement...' : 'Passer la commande'}
            </button>

            <Link to="/" className="btn-home">Retour à l'accueil</Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductCart;




