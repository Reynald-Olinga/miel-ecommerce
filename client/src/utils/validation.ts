// Définir le type du formulaire
export interface OrderFormData {
  name: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  paymentMethod: string;
  message?: string;
}

// Fonction de validation
export const validateOrderForm = (data: OrderFormData): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  if (!data.name || data.name.length < 2) {
    errors.name = "Le nom doit contenir au moins 2 caractères";
  }

  if (!/^[0-9]+$/.test(data.phone)) {
    errors.phone = "Numéro invalide (chiffres uniquement)";
  } else if (data.phone.length < 9) {
    errors.phone = "Trop court (min 9 chiffres)";
  }

  if (!data.address || data.address.length < 5) {
    errors.address = "Adresse trop courte";
  }

  if (!["Mobile Money", "Carte Bancaire", "Espèces"].includes(data.paymentMethod)) {
    errors.paymentMethod = "Moyen de paiement invalide";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};