import mongoose, { Schema } from 'mongoose';

const productSchema = new Schema({
  name: String,
  description: String,
  price: Number
});

export const Product = mongoose.model('Product', productSchema);
