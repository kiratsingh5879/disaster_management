import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  reportId: { type: mongoose.Schema.Types.ObjectId, ref: 'Report', required: true, index: true },
  volunteerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Volunteer', required: true, index: true },
  status: { type: String, enum: ['pending', 'in_progress', 'completed'], default: 'pending' }
}, { timestamps: true });

export const Task = mongoose.model('Task', taskSchema);
