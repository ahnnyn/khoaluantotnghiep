import mongoose from "mongoose";

const MedicationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    ingredient: String,
    usage: String,
    unit: { type: String, required: true },
    stock: { type: Number, default: 0 },
    price: { type: Number, default: 0 },
    status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
}, { timestamps: true });

const Medication = mongoose.model('Medication', MedicationSchema);
export default Medication;
