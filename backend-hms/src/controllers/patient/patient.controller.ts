import { NextFunction, Request, Response } from "express";
import "dotenv/config"; // sử dụng dotenv để quản lý biến môi trường
import {
  cancelMedicalExamination,
  createMedicalExamination,
  findMedicalExaminationByPatientID,
  updatePaymentStatus,
} from "services/patient/patient.services";
import { getListDoctor } from "services/admin/admin.services";
import WorkSchedule from "models/WorkSchedules";
import MedicalExamination from "models/MedicalExaminations";
import TimeSlot from "models/TimeSlot";

const postCreateMedicalExamination = async (req: Request, res: Response) => {
  try {
    const {
      patientId,
      doctorId,
      scheduledDate,
      scheduledTimeSlot,
      reasonForVisit,
      paymentMethod,
      price,
      amountPaid,
      consultationType,
    } = req.body;

    if (!patientId || !doctorId || !scheduledDate || !scheduledTimeSlot) {
      res
        .status(400)
        .json({ success: false, message: "Thiếu thông tin bắt buộc" });
      return;
    }

    const timeSlot = await TimeSlot.findOne({ timeRange: scheduledTimeSlot });
    if (!timeSlot) {
      res.status(404).json({
        success: false,
        message: "Không tìm thấy khung giờ phù hợp",
      });
      return;
    }

    // Lấy lịch làm việc và kiểm tra số lượng hiện tại trong examinationIds
    const workSchedule = await WorkSchedule.findOne({
      doctorId,
      date: new Date(`${scheduledDate}T00:00:00.000Z`),
    });

    if (!workSchedule) {
      res
        .status(404)
        .json({ success: false, message: "Không tìm thấy lịch làm việc" });
      return;
    }

    const slotIndex = workSchedule.slots.findIndex((slot) =>
      slot.timeSlotId.equals(timeSlot._id)
    );

    if (slotIndex === -1) {
      res.status(404).json({
        success: false,
        message: "Không tìm thấy khung giờ trong lịch làm việc",
      });
      return;
    }

    const slot = workSchedule.slots[slotIndex];

    if (slot.examinationIds && slot.examinationIds.length >= 3) {
      res
        .status(400)
        .json({ success: false, message: "Khung giờ này đã đủ 3 lượt đặt" });
      return;
    }

    // Tạo phiếu khám
    const newExam = await createMedicalExamination({
      patientId,
      doctorId,
      scheduledDate,
      scheduledTimeSlot,
      reasonForVisit,
      paymentMethod,
      price,
      amountPaid,
      consultationType,
    });

    // Cập nhật mảng examinationIds trong slot tương ứng
    const updatePath = `slots.${slotIndex}.examinationIds`;
    const statusPath = `slots.${slotIndex}.status`;

    const updateData: any = {
      $addToSet: {
        [updatePath]: newExam._id,
      },
    };

    // Nếu sau khi thêm là đủ 3 thì gán luôn status = 'booked'
    if ((slot.examinationIds?.length ?? 0) + 1 >= 3) {
      updateData.$set = {
        [statusPath]: "booked",
      };
    }

    await WorkSchedule.updateOne({ _id: workSchedule._id }, updateData);

    res.status(201).json({ success: true, data: newExam });
    return;
  } catch (err: any) {
    console.error("Create examination error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Tạo phiếu khám thất bại",
    });
    return;
  }
};

const putUpdatePaymentStatus = async (req: Request, res: Response) => {
  const { id, status } = req.body;
  try {
    const updatedExam = await updatePaymentStatus(id, status);
    res.status(200).json({ data: updatedExam });
    return;
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

const getMedicalExaminationsByPatient = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const examinations = await findMedicalExaminationByPatientID(id);
    res.status(200).json({ data: examinations });
    return;
  } catch (error) {
    console.error("Error fetching medical examinations:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

const putCancelMedicalExamination = async (req: Request, res: Response) => {
  const { id, status } = req.body;
  try {
    const updatedExam = await cancelMedicalExamination(id, status);
    res.status(200).json({ data: updatedExam });
    return;
  } catch (error) {
    console.error("Error updating medical examination status:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

//fetch doctor:
const getAllDoctors = async (req: Request, res: Response) => {
  try {
    const doctors = await getListDoctor(); // Lấy danh sách bác sĩ từ service
    res.status(200).json({ data: doctors }); // Gửi response về client
    return;
  } catch (error) {
    console.error("Error viewing doctors:", error);
    res.status(500).send("Internal Server Error");
    return;
  }
};

export {
  postCreateMedicalExamination,
  getMedicalExaminationsByPatient,
  putCancelMedicalExamination,
  getAllDoctors,
  putUpdatePaymentStatus,
};
