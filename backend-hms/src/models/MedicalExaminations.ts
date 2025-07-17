import mongoose from "mongoose";

const MedicalExaminationSchema = new mongoose.Schema(
  {
    // Tham chiếu hồ sơ sức khỏe bệnh nhân
    patientProfileId: {
      type: mongoose.Types.ObjectId,
      ref: "PatientProfile",
      required: false,
    },

    // Tham chiếu đến bệnh nhân (giúp truy nhanh, tránh phải populate 2 lớp)
    patientId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Bác sĩ khám
    doctorId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },

    // Triệu chứng, lý do đến khám
    reasonForVisit: {
      type: String,
      required: true,
    },

    // Tiền sử bệnh (đợt khám này khai báo lại)
    passMedicalHistory: {
      type: String,
      required: false,
    },

    // Chẩn đoán của bác sĩ
    diagnosis: {
      type: String,
    },

    // Kết luận khám
    conclusion: {
      type: String,
    },

    // Phiếu kê đơn thuốc
    prescriptionId: {
      type: mongoose.Types.ObjectId,
      ref: "Prescription",
    },

    // Trạng thái khám
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed", "cancelled"],
      default: "pending",
    },

    // Trạng thái thanh toán
    paymentStatus: {
      type: String,
      enum: ["pending", "unpaid", "paid", "refunded"],
      default: "unpaid",
    },

    // Phương thức thanh toán (nếu có)
    paymentMethod: {
      type: String,
      enum: ["cash", "momo", "banking", "vnpay", null],
      default: null,
    },

    // Giá khám bệnh
    price: {
      type: Number,
      default: 0,
    },
    // Số tiền đã thanh toán (VNĐ)
    amountPaid: {
      type: Number,
      default: 0,
    },

    scheduledDate: {
      type: Date,
      required: true,
    },

    scheduledTimeSlot: {
      type: String,
      required: true,
    },

    consultationType: {
      type: String,
      enum: ["ONLINE", "OFFLINE"],
      required: true,
    },
    
    queueNumber: {
      type: Number,
      required: false, // hoặc true nếu bạn muốn bắt buộc
      default: null,
    },
  },

  {
    timestamps: true,
    collection: "medical_examinations",
  }
);

const MedicalExamination = mongoose.model(
  "MedicalExamination",
  MedicalExaminationSchema
);
export default MedicalExamination;
