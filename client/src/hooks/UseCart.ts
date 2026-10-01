import { useState, useCallback } from 'react';
import { addToCart, fetchCart, updateItem, removeItem } from '../api/cartAPI';

export const useCart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    try {
      const { data } = await fetchCart();
      setCart(data);
    } catch (error) {
      console.error('Erreur chargement panier:', error);
    }
  }, []);

  const add = async (productId: string, containerType: string, quantity: number = 1) => {
    try {
      setLoading(true);
      await addToCart(productId, containerType, quantity);
      await refreshCart();
    } catch (error) {
      console.error('Erreur ajout au panier:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (itemId: string) => {
    try {
      setLoading(true);
      await removeItem(itemId);
      await refreshCart();
    } catch (error) {
      console.error('Erreur suppression:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      setLoading(true);
      await updateItem(itemId, quantity);
      await refreshCart();
    } catch (error) {
      console.error('Erreur mise à jour:', error);
    } finally {
      setLoading(false);
    }
  };

  return { cart, add, remove, updateQuantity, refreshCart, loading };
};