import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  type: { type: String, enum: ['shelter', 'food', 'fuel', 'medical', 'other'], required: true },
  quantity: { type: Number },
  capacity: { type: Number },
  available: { type: Number },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0,0] }
  },
  ownerOrg: { type: String },
  status: { type: String, enum: ['available', 'depleted'], default: 'available' }
}, { timestamps: true });

resourceSchema.index({ location: '2dsphere' });

export const Resource = mongoose.model('Resource', resourceSchema);
