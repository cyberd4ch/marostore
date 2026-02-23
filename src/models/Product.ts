import mongoose, { Schema, model, models } from 'mongoose';

const ProductSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    category: { type: String, required: true },
    stock: { type: Number, default: 0 },
    sizes: [String], // e.g., ['S', 'M', 'L', 'XL']
    isFeatured: { type: Boolean, default: false },
}, { timestamps: true });

// Check if the model exists before creating a new one (important for Next.js)
const Product = models.Product || model('Product', ProductSchema);
export default Product;