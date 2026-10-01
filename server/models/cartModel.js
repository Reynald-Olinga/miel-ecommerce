import mongoose from 'mongoose';
import User from './userModel.js';

export const cartSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    unique: true 
  },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    containerType: { type: String, required: true },
    quantity: { type: Number, default: 1, min: 1 }
  }], 
  total: { type: Number, default: 0 }
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;