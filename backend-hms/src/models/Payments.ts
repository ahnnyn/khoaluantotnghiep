import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    maLichKham: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MedicalExamination",
      required: true,
    },

    // Loại phương thức thanh toán: VNPAY, MOMO, QRCODE, CASH...
    method: {
      type: String,
      enum: ["vnpay", "momo", "qrcode", "cash"],
      required: true,
    },

    // Số tiền thanh toán (VND)
    amount: {
      type: Number,
      required: true,
    },

    // Trạng thái thanh toán (VD: thành công, thất bại, chờ xử lý)
    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      default: "PENDING",
    },

    // Ngày thanh toán (theo VNPAY là vnp_PayDate, còn MOMO sẽ khác)
    payDate: {
      type: Date, // hoặc type: Date nếu muốn thống nhất
    },

    // Thông tin đặc thù theo từng loại payment
    gatewayResponse: {
      type: mongoose.Schema.Types.Mixed, // lưu toàn bộ object VNPAY, MOMO response
      default: {},
    },
  },
  {
    collection: "payments",
    timestamps: true,
  }
);

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
