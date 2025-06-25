import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    examination: { type: mongoose.Schema.Types.ObjectId, ref: 'MedicalExamination' },
    amount: Number,
    method: String,
    status: String,
    paidAt: Date
});

export const Payment = mongoose.model('Payment', paymentSchema);