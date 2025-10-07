import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  phone: { type: String, unique: true, sparse: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['CITIZEN', 'VOLUNTEER', 'MODERATOR', 'ADMIN'], default: 'CITIZEN' },
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
