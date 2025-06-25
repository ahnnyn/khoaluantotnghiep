import mongoose from 'mongoose';
const { Schema } = mongoose;

const PatientProfileSchema = new Schema({
    
// Tham chiếu đến người dùng (bệnh nhân)
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // hoặc 'PatientProfile'
        required: true
    },
    fullName: { type: String, required: true }, // Họ và tên có dấu
    dateOfBirth: { type: Date, required: true }, // Ngày sinh
    phoneNumber: { type: String, required: true },
    gender: { type: String, enum: ['Nam', 'Nữ', 'Khác'], required: true },
    occupation: { type: String, required: true },
    identityNumber: { type: String, required: true }, // CCCD/Passport
    email: { type: String, required: false },
    ethnicity: { type: String, required: false },

    // Địa chỉ theo CCCD
    address: {
        province: { type: String, required: true },
        district: { type: String, required: true },
        ward: { type: String, required: true },
        streetDetail: { type: String, required: true }, // Số nhà, thôn xóm, tên đường
    },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
    }, {
    collection: 'patient_profiles',
    timestamps: true
    });

const PatientProfile = mongoose.model('PatientProfile', PatientProfileSchema);
export default PatientProfile;

