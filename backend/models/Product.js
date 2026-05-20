const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
}, { timestamps: true });

// The 3rd argument 'products' forces the collection name
module.exports = mongoose.model('Product', productSchema, 'products');