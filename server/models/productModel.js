import mongoose from 'mongoose';

const ContenantPrixSchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, 'Le type de contenant est obligatoire'],
    trim: true,
    enum: {
      values: [
        'Pot verre 250g',
        'Pot verre 500g',
        'Pot verre 1kg',
        'Bouteille 0.5L',
        'Bouteille 1L',
        'Bouteille 1.5L',
      ],
      message: 'Type de contenant non valide',
    },
  },
  prix: {
    type: Number,
    required: [true, 'Le prix est obligatoire'],
    min: [0, 'Le prix ne peut pas être négatif'],
    set: (v) => Math.round(v * 100) / 100,
  },
  prixPromo: {
    type: Number,
    min: [0, 'Le prix promo ne peut pas être négatif'],
    set: (v) => (v ? Math.round(v * 100) / 100 : undefined),
  },
  stock: {
    type: Number,
    default: 0,
    min: [0, 'Le stock ne peut pas être négatif'],
    validate: {
      validator: Number.isInteger,
      message: 'Le stock doit être un entier',
    },
  },
}, { _id: false });

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Le nom du produit est obligatoire'],
      trim: true,
      maxlength: [100, 'Le nom ne peut excéder 100 caractères'],
      index: true,
    },
    category: {
      type: String,
      enum: {
        values: ['monofloral', 'polyfloral', 'accessories', 'gift-box'],
        message: 'Catégorie non valide',
      },
      required: [true, 'La catégorie est obligatoire'],
    },
    honeyType: {
      type: String,
      enum: {
        values: [
          'acacia', 'lavender', 'thyme', 'forest', 'multifloral',
          'verveine', 'falanga', 'rayon', 'orange', 'moringa',
          'cacao', 'natural', 'cofee', 'mountain',
        ],
        message: 'Type de miel invalide',
      },
      required: [
        function () {
          return this.category !== 'accessories' && this.category !== 'gift-box';
        },
        'Le type de miel est obligatoire pour cette catégorie',
      ],
    },
    description: {
      type: String,
      required: [true, 'La description est obligatoire'],
      maxlength: [1000, 'La description ne peut excéder 1000 caractères'],
    },
    images: {
      type: [String],
      required: [true, "L'image est obligatoire"],
      default: ['/images/default-product.jpg'],
    },
    contenants: {
      type: [ContenantPrixSchema],
      required: [true, 'Au moins un contenant doit être spécifié'],
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: 'Au moins un contenant doit être spécifié',
      },
    },
    utilisation: {
      type: String,
      required: [true, "L'utilisation est obligatoire"],
      maxlength: [500, "Le champ utilisation ne peut excéder 500 caractères"],
    },
    stockGlobal: {
      type: Number,
      default: 0,
      min: [0, 'Le stock global ne peut pas être négatif'],
      validate: {
        validator: Number.isInteger,
        message: 'Le stock global doit être un entier',
      },
    },
    harvestDate: {
      type: Date,
      required: [true, 'La date de récolte est obligatoire'],
      validate: {
        validator: (v) => v <= new Date(),
        message: 'La date de récolte ne peut être future',
      },
    },
    origine: {
      type: String,
      required: [true, "L'origine est obligatoire"],
      enum: {
        values: [
          'Cameroun region Centre',
          'Cameroun region Sud-Ouest',
          'Cameroun region Adamaoua',
          'Cameroun region Littoral',
          'Cameroun region Ouest',
          'Cameroun region Nord-Ouest',
          'Cameroun region Est',
          'Cameroun region Sud',
        ],
        message: 'Origine non valide',
      },
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
// Index pour optimisation
ProductSchema.index({ name: 'text', description: 'text' });
ProductSchema.index({ 'contenants.type': 1 });
ProductSchema.index({ category: 1, honeyType: 1 });

// Virtual pour le prix minimum
ProductSchema.virtual('prixMinimum').get(function () {
  return Math.min(...this.contenants.map((c) => c.prix));
});

// Virtual pour le statut de disponibilité global
ProductSchema.virtual('disponible').get(function () {
  return this.stockGlobal > 0 && this.contenants.some((c) => c.stock > 0);
});

export default mongoose.model('Product', ProductSchema);











