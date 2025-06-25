import mongoose from "mongoose";

const timeSlotSchema = new mongoose.Schema({
  timeRange: {
    type: String,
    required: true,
    unique: true
  },
  start: {
    type: String,
    required: true
  },
  end: {
    type: String,
    required: true
  }
}, {
  collection: 'time_slots',
  timestamps: true
});

const TimeSlot = mongoose.model('TimeSlot', timeSlotSchema);
export default TimeSlot;