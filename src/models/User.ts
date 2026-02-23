import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    username: { 
        type: String, 
        required: true 
    },
    isAdmin: { 
        type: Boolean, 
        default: false 
    },
    image: { 
        type: String 
    },
}, { timestamps: true });

// This prevents Mongoose from creating the model multiple times during Next.js hot reloads
const User = models.User || model('User', UserSchema, 'users');

export default User;