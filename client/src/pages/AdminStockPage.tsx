// client/src/pages/AdminStockPage.tsx
import React, { useEffect, useState } from 'react';
import {
  fetchProducts,
  saveMultipleStockUpdates,
  downloadOrdersXLSX,
} from '../api/productService';
import { Product } from '../types';
import styles from '../styles/AdminStock.module.css';

interface StockUpdate {
  productId: string;
  containerType?: string;
  newGlobalStock?: number;
  newContainerStock?: number;
}

const AdminStockPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [localStocks, setLocalStocks] = useState<Record<string, Product>>({});
  const [pendingUpdates, setPendingUpdates] = useState<StockUpdate[]>([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchProducts();
      setProducts(data);
      const map = Object.fromEntries(data.map(p => [p._id, p]));
      setLocalStocks(map);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des produits');
    } finally {
      setLoading(false);
    }
  };

  const handleGlobalStockChange = (productId: string, newStock: number) => {
    setLocalStocks(prev => ({
      ...prev,
      [productId]: { ...prev[productId], stockGlobal: newStock },
    }));
    setPendingUpdates(prev => [
      ...prev.filter(u => !(u.productId === productId && !u.containerType)),
      { productId, newGlobalStock: newStock },
    ]);
  };

  const handleContainerStockChange = (
    productId: string,
    containerType: string,
    newStock: number
  ) => {
    setLocalStocks(prev => {
      const product = prev[productId];
      const contIndex = product.contenants.findIndex(c => c.type === containerType);
      if (contIndex !== -1) product.contenants[contIndex].stock = newStock;
      return { ...prev, [productId]: { ...product } };
    });

    setPendingUpdates(prev => [
      ...prev.filter(u => !(u.productId === productId && u.containerType === containerType)),
      { productId, containerType, newContainerStock: newStock },
    ]);
  };

  const handleSaveAll = async () => {
    try {
      await saveMultipleStockUpdates(pendingUpdates);
      setPendingUpdates([]);
      setSuccess('Tous les stocks ont été mis à jour ✅');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError('Erreur lors de la sauvegarde');
    }
  };

  const handleDownloadOrders = async () => {
    try {
      await downloadOrdersXLSX();
    } catch (err: any) {
      setError('Erreur lors du téléchargement des commandes');
    }
  };

  if (loading) return <p className={styles.adminStockLoading}>Chargement des produits…</p>;
  if (error) return <p className={styles.adminStockError}>{error}</p>;

  return (
    <div className={styles.adminStockContainer}>
      <h1 className="heading-secondary">Gestion des stocks</h1>

      <button onClick={handleDownloadOrders} className={styles.adminStockDownloadBtn}>
        📥 Télécharger les commandes
      </button>

      {success && <p className={styles.adminStockSuccess}>{success}</p>}
      {error && <p className={styles.adminStockError}>{error}</p>}

      {Object.values(localStocks).map(product => (
        <div key={product._id} className={styles.adminStockProduct}>
          <h2>{product.name} ({product.honeyType})</h2>

          <label>
            Stock global :
            <input
              type="number"
              min="0"
              value={product.stockGlobal}
              onChange={e => handleGlobalStockChange(product._id, +e.target.value)}
              className={styles.adminStockInput}
            />
          </label>

          <h4>Contenants</h4>
          {product.contenants.map(cont => (
            <div key={cont.type} className={styles.adminStockContainerItem}>
              <label>
                {cont.type} :
                <input
                  type="number"
                  min="0"
                  value={cont.stock}
                  onChange={e =>
                    handleContainerStockChange(product._id, cont.type, +e.target.value)
                  }
                  className={styles.adminStockInput}
                />
              </label>
            </div>
          ))}
        </div>
      ))}

      {pendingUpdates.length > 0 && (
        <button onClick={handleSaveAll} className={styles.adminStockSaveAllBtn}>
          💾 Enregistrer les modifications ({pendingUpdates.length})
        </button>
      )}
    </div>
  );
};

export default AdminStockPage;


