import mongoose from "mongoose";
import { PrescriptionItemSchema } from "./PrescriptionItem";

const PrescriptionSchema = new mongoose.Schema({
  medicalExaminationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MedicalExamination',
    required: true
  },
  items: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prescription_Item'
  }]
}, { timestamps: true });

const Prescription = mongoose.model('Prescription', PrescriptionSchema);
export default Prescription;
