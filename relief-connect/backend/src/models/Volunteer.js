import mongoose from 'mongoose';

const volunteerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  skills: [{ type: String }],
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0,0] }
  },
  available: { type: Boolean, default: true },
  verified: { type: Boolean, default: false },
  lastSeen: { type: Date, default: Date.now }
}, { timestamps: true });

volunteerSchema.index({ location: '2dsphere' });

export const Volunteer = mongoose.model('Volunteer', volunteerSchema);
