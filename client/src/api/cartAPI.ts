import apiClient from './client';

/* -------------------------------------------------
   Types
-------------------------------------------------- */
export interface CartItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    images: string;
    contenants: Array<{ type: string; prix: number; prixPromo?: number }>;
  };
  containerType: string;
  quantity: number;
  price: number;
}

export interface CartData {
  items: CartItem[];
  total: number;
}

export interface OrderPayload {
  items: { product: string; containerType: string; quantity: number }[];
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country?: string;
  };
  paymentMethod: string;
  message?: string;
}

/* -------------------------------------------------
   API
-------------------------------------------------- */
export const fetchCart = (): Promise<{ data: CartData }> =>
  apiClient.get('/cart');

export const addToCart = (productId: string, containerType: string, quantity: number = 1) =>
  apiClient.post('/cart', { product: productId, containerType, quantity });

export const updateItem = (itemId: string, quantity: number): Promise<{ data: CartData }> =>
  apiClient.patch(`/cart/${itemId}`, { quantity });

export const removeItem = (itemId: string): Promise<{ data: CartData }> =>
  apiClient.delete(`/cart/${itemId}`);

export const createOrder = (payload: OrderPayload): Promise<{ orderId: string }> =>
  apiClient.post('/orders', payload);

/* -------------------------------------------------
   Export par défaut (optionnel)
-------------------------------------------------- */
export default { fetchCart, updateItem, addToCart, removeItem, createOrder };