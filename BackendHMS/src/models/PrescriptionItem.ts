import mongoose from "mongoose";

export const PrescriptionItemSchema = new mongoose.Schema({
  medication: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Medication",
    required: true,
  },
  dosage: { type: String, required: true },
  frequency: { type: String, required: true },
  duration: { type: String, required: true },
  quantity: { type: Number, required: true },
  instructions: { type: String },
});

// Nếu bạn vẫn muốn export model thì ok, nhưng nhớ export schema riêng
const PrescriptionItem = mongoose.model(
  "Prescription_Item",
  PrescriptionItemSchema
);

export default PrescriptionItem;
