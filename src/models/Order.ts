import mongoose, { Schema, model, models } from 'mongoose';

const OrderSchema = new Schema({
    orderReference: { type: String, required: true, unique: true },
    customerEmail: { type: String, required: true },
    momoNumber: { type: String },
    items: [{
        name: String,
        price: Number,
        quantity: Number,
        imageUrl: String
    }],
    totalAmount: { type: Number, required: true },
    status: { type: String, default: 'Pending', enum: ['Pending', 'Processing', 'Shipped', 'Delivered'] },
    paymentStatus: { type: String, default: 'Unpaid' },
}, { timestamps: true });

const Order = models.Order || model('Order', OrderSchema);
export default Order;