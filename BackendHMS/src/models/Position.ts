import mongoose from 'mongoose';

const positionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true // ví dụ: 'Trưởng khoa', 'Bác sĩ điều trị'
  },
  description: {
    type: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true,
  collection: 'positions'
});

const Position = mongoose.model('Position', positionSchema);
export default Position;
