import getConnection from "config/connect.mongo";
import "dotenv/config"; // sử dụng dotenv để quản lý biến môi trường
import MedicalExamination from "models/MedicalExaminations";
import PatientProfile from "models/PatientProfile";
import Role from "models/Roles";
import User from "models/Users";

// Patient Profiles

const findPatientProfiles = async (patientId: string) => {
  return await PatientProfile.find({ patientId });
};

const createPatientProfile = async (
  patientId: string,
  fullName: string,
  dateOfBirth: Date,
  phoneNumber: string,
  gender: boolean,
  occupation: string,
  indentityNumber: string,
  email: string,
  ethnicity: string,
  address: string
) => {
  await PatientProfile.create({
    patientId,
    fullName,
    dateOfBirth,
    phoneNumber,
    gender,
    occupation,
    indentityNumber,
    email,
    ethnicity,
    address,
  });
};

const updatePatientProfile = async (
  patientId: string,
  fullName?: string,
  dateOfBirth?: Date,
  phoneNumber?: string,
  gender?: boolean,
  occupation?: string,
  indentityNumber?: string,
  email?: string,
  ethnicity?: string,
  address?: string
) => {
  const updateData: any = {
    ...(fullName !== undefined && { fullName }),
    ...(dateOfBirth !== undefined && { dateOfBirth }),
    ...(phoneNumber !== undefined && { phoneNumber }),
    ...(gender !== undefined && { gender }),
    ...(occupation !== undefined && { occupation }),
    ...(indentityNumber !== undefined && { indentityNumber }),
    ...(email !== undefined && { email }),
    ...(ethnicity !== undefined && { ethnicity }),
    ...(address !== undefined && { address }),
  };

  const result = await PatientProfile.updateOne({ patientId }, updateData);
  if (result.modifiedCount === 0) {
    throw new Error(
      "Cập nhật thông tin bệnh nhân không thành công hoặc không có thay đổi nào."
    );
  }
  return result;
};

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
          select: "name unit usage ingredient",
        },
      },
    })
    .lean();
};

const cancelMedicalExamination = async (id: string, status: string) => {};

//fetch doctor
const getListDoctor = async () => {
  const doctorRole = await Role.findOne({ roleName: "DOCTOR" });

  if (!doctorRole) {
    throw new Error('Role "doctor" not found');
  }

  const doctors = await User.find({
    roleId: doctorRole._id,
    status: "active",
  })
    .select("-password")
    .populate("roleId")
    .populate("positionId")
    .populate("departmentId");

  return doctors;
};

const createMedicalExamination = async (data: any) => {
  const {
    patientId,
    doctorId,
    scheduledDate,
    scheduledTimeSlot,
    reasonForVisit,
    paymentMethod,
    price,
  } = data;


  const parsedDate = new Date(`${scheduledDate}T00:00:00.000Z`);
  if (isNaN(parsedDate.getTime())) {
    throw new Error("Ngày khám không hợp lệ");
  }

  const newExam = await MedicalExamination.create({
    patientId,
    doctorId,
    scheduledDate: parsedDate,
    scheduledTimeSlot,
    reasonForVisit,
    paymentMethod: paymentMethod?.toLowerCase(), // enum fix
    price,
    paymentStatus: "pending",
  });

  return newExam;
};

const updatePaymentStatus = async (id: string, status: string) => {
  const validStatuses = ["pending", "paid", "cancelled"];
  if (!validStatuses.includes(status)) {
    throw new Error("Trạng thái thanh toán không hợp lệ");
  }
  const result = await MedicalExamination.updateOne(
    { _id: id },
    { paymentStatus: status }
  );
  if (result.modifiedCount === 0) {
    throw new Error("Cập nhật trạng thái thanh toán không thành công");
  }
  return result;
}

export {
  findMedicalExaminationByPatientID,
  cancelMedicalExamination,
  findPatientProfiles,
  createPatientProfile,
  updatePatientProfile,
  getListDoctor,
  createMedicalExamination,
  updatePaymentStatus,
};
