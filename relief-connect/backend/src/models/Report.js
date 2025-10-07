import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema({
  url: String,
  type: { type: String, enum: ['image', 'video', 'other'], default: 'image' }
}, { _id: false });

const reportSchema = new mongoose.Schema({
  reporterId: { type: String },
  description: { type: String, required: true },
  category: { type: String, enum: ['fire', 'medical', 'flood', 'blocked_road', 'other'], required: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }
  },
  severity: { type: Number, min: 1, max: 5, default: 3 },
  status: { type: String, enum: ['unverified', 'verified', 'resolved'], default: 'unverified' },
  media: [mediaSchema],
  source: { type: String, enum: ['app', 'sms', 'web'], default: 'app' }
}, { timestamps: true });

reportSchema.index({ location: '2dsphere' });

export const Report = mongoose.model('Report', reportSchema);
