// src/types.ts - VERSION FINALE CORRIGÉE

// Interface Produit (inchangée)
export interface Product {
  _id: string;
  name: string;
  price: number;
  description?: string;
  images: string[];
  category?: string;
  featured?: boolean;
  originalPrice?: number;
  stock?: number;
  contenants: Array<{
    type: string;
    prix: number;
    prixPromo?: number;
    stock: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

// Interface Panier (inchangée)
export interface CartItem {
  _id: string;
  product: Product;
  containerType: string;
  quantity: number;
  price: number;
}

export interface CartData {
  items: CartItem[];
  total: number;
}

// 🔧 STRUCTURE EXACTE UTILISÉE PAR REACT
export interface OrderFormData {
  name: string;
  phone: string;
  address: string;
  city: string;
  paymentMethod: 'Mobile Money' | 'Orange Money' | 'Carte Bancaire' | 'Espèces';
  message?: string;
}

// 🔧 PAYLOAD REEL ENVOYÉ PAR REACT (CRUCIAL !)
export interface OrderPayload {
  items: Array<{
    product: string;
    containerType: string;
    quantity: number;
  }>;
  shippingAddress: {
    address: string;
    city: string;
    country?: string;
  };
  paymentMethod: 'Mobile Money' | 'Orange Money' | 'Carte Bancaire' | 'Espèces';
  message?: string;
  customer: {
    name: string;
    phone: string;
  };
  total: number;
}

// 🔧 STRUCTURE SIMPLIFIÉE POUR LE BACKEND
export interface BackendOrderPayload {
  items: Array<{
    product: string;
    containerType: string;
    quantity: number;
  }>;
  shippingAddress: {
    address: string;
    city: string;
    country?: string;
    postalCode?: string;
  };
  paymentMethod: string;
  message?: string;
  customer: {
    name: string;
    phone: string;
  };
  total: number;
}

// 🔧 RÉPONSE API
export interface OrderResponse {
  success: boolean;
  data: {
    _id: string;
    user: {
      _id: string;
      name: string;
      email: string;
    };
    items: Array<{
      product: {
        _id: string;
        name: string;
        images: string[];
      };
      name: string;
      image: string;
      container: {
        type: string;
        unitPrice: number;
        quantity: number;
      };
      price: number;
    }>;
    shippingAddress: {
      address: string;
      city: string;
      country: string;
      postalCode: string;
    };
    paymentMethod: string;
    totalPrice: number;
    status: string;
    message?: string;
    createdAt: string;
    customerInfo?: {
      name: string;
      phone: string;
    };
  };
  message: string;
}

// Types utilitaires
export type PaymentMethod = 'Mobile Money' | 'Orange Money' | 'Carte Bancaire' | 'Espèces';
export type OrderStatus = 'En attente' | 'Confirmée' | 'Expédiée' | 'Livrée' | 'Annulée';