import Payment from "models/Payments";
import { vnpayConfig } from "config/payment.config";
import crypto from "crypto";
import qs from "qs";
import MedicalExamination from "models/MedicalExaminations";
const createPayment = async (paymentData: any) => {
  const { maLichKham, method, amount, status, payDate, gatewayResponse } =
    paymentData;

  // Kiểm tra lịch khám có tồn tại không
  const appointment = await MedicalExamination.findById(maLichKham);
  if (!appointment) {
    throw new Error("Không tìm thấy lịch khám tương ứng.");
  }

  // Tính số thứ tự (lấy số lớn nhất trong ngày & bác sĩ)
  const currentMax = await MedicalExamination.findOne({
    scheduledDate: appointment.scheduledDate,
    scheduledTimeSlot: appointment.scheduledTimeSlot,
    doctorId: appointment.doctorId,
    queueNumber: { $ne: null },
  })
    .sort({ queueNumber: -1 })
    .select("queueNumber");

  const newQueueNumber = (currentMax?.queueNumber || 0) + 1;

  appointment.queueNumber = newQueueNumber;
  appointment.paymentStatus = "paid";
  appointment.paymentMethod = method.toLowerCase(); // VNPAY → "vnpay"
  await appointment.save();

  const newPayment = new Payment({
    maLichKham,
    method,
    amount,
    status: status || "SUCCESS",
    payDate: payDate || new Date().toISOString(),
    gatewayResponse: gatewayResponse || {},
  });

  await newPayment.save();

  return newPayment;
};
const createVnPayUrl = ({
  maLichKham,
  amount,
  tenNguoiDung,
  ipAddr = "127.0.0.1",
}: {
  maLichKham: string;
  amount: number;
  tenNguoiDung: string;
  ipAddr?: string;
}) => {
  const now = new Date(Date.now() + 7 * 60 * 60 * 1000); // +7h VN
  const formatDate = (d: Date) =>
    `${d.getFullYear()}${(d.getMonth() + 1).toString().padStart(2, "0")}${d
      .getDate()
      .toString()
      .padStart(2, "0")}${d.getHours().toString().padStart(2, "0")}${d
      .getMinutes()
      .toString()
      .padStart(2, "0")}${d.getSeconds().toString().padStart(2, "0")}`;

  const vnp_CreateDate = formatDate(now);
  const vnp_ExpireDate = formatDate(new Date(now.getTime() + 15 * 60 * 1000));

  const inputData: Record<string, string> = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: vnpayConfig.vnp_TmnCode,
    vnp_Amount: (amount * 100).toString(),
    vnp_CurrCode: "VND",
    vnp_TxnRef: maLichKham,
    vnp_OrderInfo: `Thanh toán lịch khám ${maLichKham} của ${tenNguoiDung}`,
    vnp_OrderType: "billpayment",
    vnp_Locale: "vn",
    vnp_ReturnUrl: vnpayConfig.vnp_ReturnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate,
    vnp_ExpireDate,
    vnp_BankCode: "NCB",
  };

  // 1. Sort và build hashData theo chuẩn URLSearchParams
  const sortedParams = new URLSearchParams();
  Object.keys(inputData)
    .sort()
    .forEach((key) => {
      sortedParams.append(key, inputData[key]);
    });

  const hashData = sortedParams.toString(); // không cần encode thủ công

  // 2. Tạo secure hash
  const secureHash = crypto
    .createHmac("sha512", vnpayConfig.vnp_HashSecret)
    .update(Buffer.from(hashData, "utf-8"))
    .digest("hex");

  // 3. Append secure hash vào URL
  const paymentUrl = `${
    vnpayConfig.vnp_Url
  }?${sortedParams.toString()}&vnp_SecureHash=${secureHash}`;

  return {
    status: true,
    paymentUrl,
  };
};

export { createPayment, createVnPayUrl };
