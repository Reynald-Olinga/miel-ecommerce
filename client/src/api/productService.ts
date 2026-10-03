// client/src/api/productService.ts
import apiClient from './client';
import { Product } from '../types';

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const { data } = await apiClient.get('/products');
    return data?.data || [];
  } catch (err: any) {
    console.error('Erreur lors du chargement des produits :', err);
    return [];
  }
};

export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const { data } = await apiClient.get(`/products/${id}`);
    return data?.data || null;
  } catch (err: any) {
    console.error(`Erreur lors du chargement du produit ${id} :`, err);
    return null;
  }
};

export const searchProducts = async (query: string): Promise<Product[]> => {
  try {
    const { data } = await apiClient.get('/products/search', {
      params: { q: query },
    });
    return data?.data || [];
  } catch (err: any) {
    console.error('Erreur recherche produits :', err);
    return [];
  }
};

export const updateProductGlobalStock = async (
  id: string,
  newStock: number
): Promise<Product | null> => {
  try {
    const { data } = await apiClient.patch(`/products/${id}/stock-global`, {
      stockGlobal: newStock,
    });
    return data?.data || null;
  } catch (err: any) {
    console.error(`Erreur mise à jour stock global produit ${id} :`, err);
    return null;
  }
};

// client/src/api/productService.ts
export const saveMultipleStockUpdates = async (
  updates: {
    productId: string;
    containerType?: string;
    newGlobalStock?: number;
    newContainerStock?: number;
  }[]
): Promise<void> => {
  try {
    await apiClient.post('/products/stock-batch', { updates });
  } catch (err: any) {
    console.error('Erreur sauvegarde batch :', err);
    throw err;
  }
};

export const updateContainerStock = async (
  id: string,
  containerType: string,
  newStock: number
): Promise<Product | null> => {
  try {
    const { data } = await apiClient.patch(
      `/products/${id}/containers/${containerType}/stock`,
      { stock: newStock }
    );
    return data?.data || null;
  } catch (err: any) {
    console.error(
      `Erreur mise à jour stock contenant ${containerType} produit ${id} :`,
      err
    );
    return null;
  }
};

/**
 * Télécharge le fichier XLSX contenant toutes les commandes
 */
export const downloadOrdersXLSX = async () => {
  try {
    const response = await apiClient.get('/orders/export', {
      responseType: 'blob', // Important pour télécharger un fichier
    });

    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'commandes.xlsx';
    link.click();
  } catch (err: any) {
    console.error('Erreur lors du téléchargement du fichier XLSX :', err);
    throw err;
  }
};

export default {
  fetchProducts,
  getProductById,
  searchProducts,
  updateProductGlobalStock,
  updateContainerStock,
  downloadOrdersXLSX,
};
