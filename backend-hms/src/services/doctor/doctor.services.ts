import getConnection from "config/connect.mongo";
import "dotenv/config"; // sử dụng dotenv để quản lý biến môi trường
import PatientProfile from "models/PatientProfile";
import MedicalExamination from "models/MedicalExaminations";
import WorkSchedule from "models/WorkSchedules";
import Department from "models/Departments";
import Position from "models/Position";
import TimeSlot from "models/TimeSlot";
import Prescription from "models/Prescription";
import PrescriptionItem from "models/PrescriptionItem";
import Medication from "models/Medication";



const findMedicalExaminationByPatientID = async (patientId: string) => {
  return await MedicalExamination.find({ patientId })
    .populate("patientProfileId", "fullName email phoneNumber")
    .populate("doctorId", "fullName email")
    .populate({
      path: "prescriptionId",
      populate: {
        path: "items",
        populate: {
          path: "medication",
          select: "name unit usage ingredient"
        }
      }
    })
    .lean();
};

const findMedicalExaminationByDoctorID = async (doctorId: string) => {
  return await MedicalExamination.find({ doctorId })
    .populate("patientProfileId", "fullName email phoneNumber")
    .populate("doctorId", "fullName email")
    .populate({
      path: "prescriptionId",
      populate: {
        path: "items",
        populate: {
          path: "medication",
          select: "name unit usage ingredient"
        }
      }
    })
    .lean();
};


const findMedicalExaminationByID = async (id: string) => {
    return await MedicalExamination.findById(id)
    .populate("patientProfileId", "fullName email phoneNumber")
    .populate("doctorId", "fullName email")
    .populate({
      path: "prescriptionId",
      populate: {
        path: "items",
        populate: {
          path: "medication",
          select: "name unit usage ingredient"
        }
      }
    })
    .lean();
}

const updateStatusMedicalExamination = async (id: string, status: string) => {
  const allowedStatuses = ['pending', 'in_progress', 'completed', 'cancelled'] as const;
  type StatusType = typeof allowedStatuses[number];

  if (!allowedStatuses.includes(status as StatusType)) {
    throw new Error("Invalid status value");
  }

  const medicalExamination = await MedicalExamination.findById(id);
  if (!medicalExamination) {
    throw new Error("Medical examination not found");
  }

  medicalExamination.status = status as StatusType;
  return await medicalExamination.save();
};


const updateResultMedicalExamination = async (
  id: string,
  result: {
    diagnosis: string;
    conclusion: string;
    prescriptionItems: {
      tenThuoc: string;
      lieuLuong: string;
      soLanDungTrongNgay: number;
      soNgayDung: number;
      ghiChu?: string;
    }[];
  }
) => {
  const medicalExam = await MedicalExamination.findById(id);
  if (!medicalExam) throw new Error("Không tìm thấy phiếu khám");

  // Cập nhật thông tin cơ bản
  medicalExam.diagnosis = result.diagnosis;
  medicalExam.conclusion = result.conclusion;
  medicalExam.status = "completed";

  // Nếu phiếu khám đã có đơn thuốc, xóa Prescription và các PrescriptionItem liên quan
  if (medicalExam.prescriptionId) {
    const oldPrescription = await Prescription.findById(medicalExam.prescriptionId);
    if (oldPrescription) {
      // Xoá từng PrescriptionItem
      await PrescriptionItem.deleteMany({ _id: { $in: oldPrescription.items } });
      // Xoá Prescription
      await Prescription.findByIdAndDelete(oldPrescription._id);
    }
    medicalExam.prescriptionId = undefined;
  }

  // Nếu có đơn thuốc mới -> tạo mới Prescription
  if (result.prescriptionItems && result.prescriptionItems.length > 0) {
    const newPrescriptionItems = [];

    for (const item of result.prescriptionItems) {
      const med = await Medication.findOne({ name: item.tenThuoc });
      if (!med) throw new Error(`Không tìm thấy thuốc: ${item.tenThuoc}`);

      const newItem = await PrescriptionItem.create({
        medication: med._id,
        dosage: item.lieuLuong,
        frequency: `${item.soLanDungTrongNgay} lần/ngày`,
        duration: `${item.soNgayDung} ngày`,
        quantity: item.soLanDungTrongNgay * item.soNgayDung,
        instructions: item.ghiChu || "",
      });

      newPrescriptionItems.push(newItem._id);
    }

    const newPrescription = await Prescription.create({
      medicalExaminationId: medicalExam._id,
      items: newPrescriptionItems,
    });

    medicalExam.prescriptionId = newPrescription._id as any;
  }

  return await medicalExam.save();
};


const findWorkScheduleByDoctorID = async (doctorId: string) => {
  return await WorkSchedule.find({ doctorId }) 
    .populate({
      path: "slots.timeSlotId",
      select: "timeRange start end",
    })
    .populate({
      path: "slots.examinationIds",
      select: "patientProfileId status",
      populate: {
        path: "patientProfileId",
        select: "fullName",
        model: "PatientProfile",
      },
    })
    .lean();
};



const findWorkScheduleByDate = async (doctorId: string, date: Date) => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return await WorkSchedule.find({
        doctorId: doctorId,
        date: {
            $gte: startOfDay,
            $lte: endOfDay
        }
    });
}

const findWordScheduleByDoctorIDAndType = async (doctorId: string, examinationType: string) => {
    return await WorkSchedule.find({ doctorId: doctorId, "slots.examinationType": examinationType })
        .select("slots.$")
        .lean();
}

const getListDepartment = async () => {
    return await Department.find().lean();
};

const getListPosition = async () => {
    return await Position.find().lean();
}

const getAllTimeSlots = async () => {
    return await TimeSlot.find().lean();
}

const createWorkSchedule = async (workScheduleData: any) => {
    const { doctorId, date, slots } = workScheduleData;

    const normalizedDate = new Date(date);

    const currentType = slots[0]?.examinationType;
    if (!currentType) throw new Error("Missing examinationType in slots");

    let schedule = await WorkSchedule.findOne({ doctorId, date: normalizedDate });

    const incomingSlotKeys = new Set(
      slots.map((s: any) => `${s.timeSlotId}-${s.examinationType}`)
    );

    if (!schedule) {
      // Nếu chưa có lịch thì tạo mới luôn
      return await WorkSchedule.create({
        doctorId,
        date: normalizedDate,
        slots,
      });
    }

    // Tách các slot hiện có thành:
    // - slot khác loại (không phải loại đang gửi lên): giữ nguyên
    // - slot cùng loại: xử lý so sánh
    const otherTypeSlots = schedule.slots.filter(
      (s) => s.examinationType !== currentType
    );

    const sameTypeSlots = schedule.slots.filter(
      (s) => s.examinationType === currentType
    );

    const existingKeys = new Set(
      sameTypeSlots.map((s) => `${s.timeSlotId}-${s.examinationType}`)
    );

    // Những slot cùng loại cần giữ lại (vẫn còn trong request)
    const keepSlots = sameTypeSlots.filter((s) =>
      incomingSlotKeys.has(`${s.timeSlotId}-${s.examinationType}`)
    );

    // Những slot mới (chưa có trong DB)
    const newSlots = slots.filter(
      (s: any) =>
        !existingKeys.has(`${s.timeSlotId}-${s.examinationType}`)
    );

    // Gộp lại: slot khác loại + slot giữ lại cùng loại + slot mới
    schedule.slots = [...otherTypeSlots, ...keepSlots, ...newSlots];

    await schedule.save();
    return schedule;
};




export {
    findMedicalExaminationByPatientID,
    findMedicalExaminationByDoctorID,
    findMedicalExaminationByID,
    updateStatusMedicalExamination,
    updateResultMedicalExamination,
    findWorkScheduleByDoctorID,
    findWorkScheduleByDate,
    findWordScheduleByDoctorIDAndType,
    getListDepartment,
    getListPosition,
    getAllTimeSlots,
    createWorkSchedule
}