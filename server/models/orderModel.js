import mongoose from 'mongoose';

// Schéma pour les contenants dans les items
const OrderItemContainerSchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, 'Le type de contenant est obligatoire']
  },
  unitPrice: {
    type: Number,
    required: [true, 'Le prix unitaire est obligatoire'],
    min: [0, 'Le prix ne peut pas être négatif']
  },
  quantity: {
    type: Number,
    required: [true, 'La quantité est obligatoire'],
    min: [1, 'La quantité doit être au moins 1']
  }
}, { _id: false });

// Schéma pour les items de commande
const OrderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Le produit est obligatoire']
  },
  name: {
    type: String,
    required: [true, 'Le nom du produit est obligatoire']
  },
  image: {
    type: String,
    required: [true, "L'image est obligatoire"]
  },
  container: {
    type: OrderItemContainerSchema,
    required: [true, 'Le contenant est obligatoire']
  },
  price: {
    type: Number,
    required: [true, 'Le prix total est obligatoire'],
    min: [0, 'Le prix ne peut pas être négatif']
  }
}, { _id: false });

// Schéma pour l'adresse de livraison
const ShippingAddressSchema = new mongoose.Schema({
  address: { 
    type: String, 
    required: [true, 'L\'adresse est obligatoire'],
    trim: true 
  },
  city: { 
    type: String, 
    required: [true, 'La ville est obligatoire'],
    trim: true 
  },
  postalCode: { 
    type: String, 
    default: '00000',
    trim: true 
  },
  country: { 
    type: String, 
    default: 'Cameroun',
    trim: true 
  }
}, { _id: false });

// Schéma pour les informations client
const CustomerInfoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom du client est obligatoire'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Le numéro de téléphone est obligatoire'],
    trim: true
  }
}, { _id: false });

// Schéma principal de commande
const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'L\'utilisateur est obligatoire']
  },
  items: {
    type: [OrderItemSchema],
    required: [true, 'Au moins un article est obligatoire'],
    validate: {
      validator: function(v) {
        return v.length > 0;
      },
      message: 'La commande doit contenir au moins un article'
    }
  },
  shippingAddress: {
    type: ShippingAddressSchema,
    required: [true, 'L\'adresse de livraison est obligatoire']
  },
  customerInfo: {
    type: CustomerInfoSchema,
    required: [true, 'Les informations client sont obligatoires']
  },
  paymentMethod: {
    type: String,
    required: [true, 'Le mode de paiement est obligatoire'],
    enum: {
      values: ['Mobile Money', 'Orange Money', 'Carte Bancaire', 'PayPal', 'Espèces'],
      message: 'Mode de paiement non valide: {VALUE}'
    }
  },
  totalPrice: {
    type: Number,
    required: [true, 'Le prix total est obligatoire'],
    min: [0, 'Le prix total ne peut pas être négatif']
  },
  status: {
    type: String,
    enum: {
      values: ['En attente', 'Confirmée', 'Expédiée', 'Livrée', 'Annulée'],
      message: 'Statut non valide: {VALUE}'
    },
    default: 'En attente'
  },
  message: {
    type: String,
    maxlength: [500, 'Le message ne peut pas dépasser 500 caractères']
  },
  trackingNumber: String,
  deliveredAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index pour optimisation
OrderSchema.index({ user: 1, status: 1 });
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ 'items.product': 1 });

// Virtual pour le statut de paiement
OrderSchema.virtual('isPaid').get(function() {
  return this.status === 'Confirmée' || this.status === 'Expédiée' || this.status === 'Livrée';
});

export default mongoose.model('Order', OrderSchema);







