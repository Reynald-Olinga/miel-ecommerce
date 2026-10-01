// client/src/context/CartContext.tsx
import React, { createContext, useReducer, ReactNode } from 'react';
import { Product } from '../types';

export interface CartItem {
  product: Product;
  contenant: { type: string; prix: number };
}

interface CartState {
  items: CartItem[];
}

export type CartAction =
  | { type: 'ADD'; payload: CartItem }
  | { type: 'REMOVE'; payload: { id: string; type: string } }
  | { type: 'CLEAR' };

export interface CartContextType {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (id: string, type: string) => void;
  clear: () => void;
}

// ✅ Exportez le contexte ici
export const CartCtx = createContext<CartContextType>({
  items: [],
  add: () => {},
  remove: () => {},
  clear: () => {},
});

const reducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD':
      return { ...state, items: [...state.items, action.payload] };
    case 'REMOVE':
      return {
        ...state,
        items: state.items.filter(
          (i) =>
            !(
              i.product._id === action.payload.id &&
              i.contenant.type === action.payload.type
            )
        ),
      };
    case 'CLEAR':
      return { items: [] };
    default:
      return state;
  }
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, { items: [] });

  const add = (item: CartItem) => dispatch({ type: 'ADD', payload: item });
  const remove = (id: string, type: string) =>
    dispatch({ type: 'REMOVE', payload: { id, type } });
  const clear = () => dispatch({ type: 'CLEAR' });

  return (
    <CartCtx.Provider value={{ items: state.items, add, remove, clear }}>
      {children}
    </CartCtx.Provider>
  );
};

// ❌ Ne surtout PAS exporter useCart ici




