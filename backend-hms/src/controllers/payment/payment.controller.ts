import { Request, Response } from "express";
import MedicalExamination from "models/MedicalExaminations";
import {
  createPayment,
  createVnPayUrl,
} from "services/payment/payment.services";

const handleCreatePayment = async (req: Request, res: Response) => {
  try {
    const { maLichKham, method, amount, status, payDate, gatewayResponse } =
      req.body;

    if (!maLichKham || !method || !amount) {
      res.status(400).json({
        success: false,
        message: "Missing required fields: maLichKham, method, or amount.",
      });
      return;
    }

    const payment = await createPayment({
      maLichKham,
      method,
      amount,
      status,
      payDate,
      gatewayResponse,
    });

    const appointment = await MedicalExamination.findById(maLichKham)
      .populate({
        path: "doctorId",
        select: "fullName positionId departmentId",
        populate: [
          { path: "positionId", select: "name" },
          { path: "departmentId", select: "name" },
        ],
      })
      .populate("patientId", "fullName gender dateOfBirth");

    if (!appointment) {
      res.status(404).json({
        success: false,
        message: "Không tìm thấy lịch khám sau khi tạo thanh toán.",
      });
      return;
    }

    const doctor: any = appointment.doctorId;

    const resultData = {
      doctorName: doctor?.fullName || "N/A",
      department: Array.isArray(doctor?.departmentId)
        ? doctor.departmentId.map((d: any) => d.name).join(", ")
        : "N/A",
      position: Array.isArray(doctor?.positionId)
        ? doctor.positionId.map((p: any) => p.name).join(", ")
        : "N/A",
      appointmentDate: appointment.scheduledDate,
      appointmentTime: appointment.scheduledTimeSlot,
      consultationType: appointment.paymentMethod,
      location:
        appointment.paymentMethod === "offline"
          ? "Phòng khám A1, Bệnh viện XYZ"
          : "Khám trực tuyến",
      queueNumber: appointment.queueNumber || "Đang cập nhật",
      maLichKham: appointment._id,
    };

    res.status(201).json({
      success: true,
      message: "Tạo thanh toán và cập nhật lịch khám thành công.",
      data: payment,
      appointmentInfo: resultData,
    });
  } catch (err: any) {
    console.error("handleCreatePayment error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Lỗi hệ thống khi tạo thanh toán.",
    });
  }
};

const handleCreateVnPayUrl = (req: Request, res: Response) => {
  try {
    const { maLichKham, amount, tenNguoiDung } = req.body;

    if (!maLichKham || !amount || !tenNguoiDung) {
      res.status(400).json({
        success: false,
        message:
          "Missing required fields: maLichKham, amount, or tenNguoiDung.",
      });
    }

    const ip =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress || "127.0.0.1";

    const result = createVnPayUrl({
      maLichKham,
      amount,
      tenNguoiDung,
      ipAddr: Array.isArray(ip) ? ip[0] : ip,
    });

    res.json({ success: true, ...result });
  } catch (err: any) {
    console.error("handleCreateVnPayUrl error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
};

export { handleCreatePayment, handleCreateVnPayUrl };
