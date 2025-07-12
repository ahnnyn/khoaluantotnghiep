// seed.ts
import Role from "models/Roles";
import Position from "models/Position";
import Department from "models/Departments";
import User from "models/Users";
import PatientProfile from "models/PatientProfile";
import MedicalExamination from "models/MedicalExaminations";
import Medication from "models/Medication";
import Prescription from "models/Prescription";
import bcrypt from "bcrypt";
import WorkSchedule from "models/WorkSchedules";
import PrescriptionItem from "models/PrescriptionItem";
import TimeSlot from "models/TimeSlot";

export const seedVaiTro = async () => {
  const existing = await Role.findOne({ roleName: "admin" });
  if (!existing) {
    await Role.create([
      {
        roleName: "admin",
        description: "Quản trị viên hệ thống",
        status: "active",
      },
      {
        roleName: "doctor",
        description: "Người dùng là bác sĩ",
        status: "active",
      },
      {
        roleName: "patient",
        description: "Người dùng là bệnh nhân",
        status: "active",
      },
    ]);
    console.log("VaiTro seeded!");
  } else {
    console.log("VaiTro already exists");
  }
};

export const seedChuVu = async () => {
  await Position.create([
    {
      name: "Trưởng khoa",
      description: "Chịu trách nhiệm quản lý toàn bộ khoa",
      status: "active",
    },
    {
      name: "Bác sĩ điều trị",
      description: "Thăm khám và điều trị bệnh nhân",
      status: "active",
    },
  ]);
  console.log("ChuVu seeded!");
};

export const seedDepartment = async () => {
  await Department.create([
    {
      name: "Khoa Nội",
      image: "noikhoa.jpg",
      description: "Chuyên điều trị bệnh nội khoa",
      status: "active",
    },
    {
      name: "Khoa Nhi",
      image: "khoanhi.jpg",
      description: "Chăm sóc và điều trị cho trẻ em",
      status: "active",
    },
  ]);
  console.log("Department seeded!");
};

export const seedMultipleUsers = async () => {
  const roles = await Role.find();
  const positions = await Position.find();
  const departments = await Department.find();

  const hashedDoctorPassword = await bcrypt.hash("123456", 10);
  const hashedPatientPassword = await bcrypt.hash("123456", 10);

  const doctorData = [
    {
      fullName: "Nguyễn Văn Bác Sĩ",
      username: "doctor01",
      email: "doctor01@example.com",
    },
    {
      fullName: "Trần Thị Khánh Linh",
      username: "doctor02",
      email: "doctor02@example.com",
    },
  ];

  const patientData = [
    {
      fullName: "Trần Anh Minh",
      username: "patient01",
      email: "patient01@example.com",
      gender: false,
    },
    {
      fullName: "Lê Văn Hậu",
      username: "patient02",
      email: "patient02@example.com",
      gender: true,
    },
  ];

  const doctorUsers = await Promise.all(
    doctorData.map((data) =>
      User.create({
        ...data,
        gender: true,
        dateOfBirth: new Date("1980-01-01"),
        phone: "090000000" + data.username.slice(-1),
        address: "Hà Nội",
        password: hashedDoctorPassword,
        accountType: "SYSTEM",
        roleId: roles.find((r) => r.roleName === "doctor")?._id,
        positionId: [positions[1]._id],
        departmentId: [departments[0]._id],
      })
    )
  );

  const patientUsers = await Promise.all(
    patientData.map((data) =>
      User.create({
        ...data,
        dateOfBirth: new Date("2000-01-01"),
        phone: "098888888" + data.username.slice(-1),
        address: "TP.HCM",
        password: hashedPatientPassword,
        accountType: "SYSTEM",
        roleId: roles.find((r) => r.roleName === "patient")?._id,
      })
    )
  );

  console.log("Multiple Users seeded!");
  return { doctorUsers, patientUsers };
};

export const seedMultiplePatientProfiles = async (patients: any[]) => {
  const profiles = await Promise.all(
    patients.map((patient) =>
      PatientProfile.create({
        patientId: patient._id,
        fullName: patient.fullName,
        dateOfBirth: patient.dateOfBirth,
        phoneNumber: patient.phone,
        gender: patient.gender ? "Nam" : "Nữ",
        occupation: "Sinh viên",
        identityNumber: "12345678" + patient.username.slice(-1),
        email: patient.email,
        ethnicity: "Kinh",
        address: {
          province: "TP.HCM",
          district: "Quận 1",
          ward: "Phường Bến Nghé",
          streetDetail: "Số 1 Nguyễn Huệ",
        },
      })
    )
  );

  console.log("Multiple PatientProfiles seeded!");
  return profiles;
};

export const seedMedication = async () => {
  const meds = await Medication.create([
    { name: "Paracetamol", unit: "viên", price: 2000 },
    { name: "Amoxicillin", unit: "viên", price: 3000 },
    { name: "Ibuprofen", unit: "viên", price: 2500 },
    { name: "Vitamin C", unit: "viên", price: 1500 },
    { name: "Azithromycin", unit: "viên", price: 4000 },
  ]);
  console.log("Medication seeded!");
  return meds;
};

export const seedPrescription = async (
  examId: any,
  meds: any[]
): Promise<typeof Prescription.prototype> => {
  const prescription = await Prescription.create({
    medicalExaminationId: examId,
    items: [],
  });

  const items = await PrescriptionItem.insertMany([
    {
      medication: meds[0]._id,
      dosage: "500mg",
      frequency: "3 lần/ngày",
      duration: "5 ngày",
      quantity: 10,
      instructions: "Uống sau ăn",
    },
    {
      medication: meds[1]._id,
      dosage: "250mg",
      frequency: "2 lần/ngày",
      duration: "7 ngày",
      quantity: 14,
      instructions: "Uống trước ăn",
    },
  ]);

  prescription.items = items.map((item) => item._id);
  await prescription.save();

  console.log("Prescription & PrescriptionItems seeded!");
  return prescription;
};

const randomReasons = ['Khám ho sốt', 'Khám đau đầu', 'Khám đau bụng'];
const randomDiagnoses = ['Cảm cúm', 'Thiếu máu não', 'Viêm dạ dày'];

export const seedMedicalExamination = async (
  users: { patient: any; doctor: any },
  prescription: any,
  profile: any
) => {
  const exam = await MedicalExamination.create({
    patientId: users.patient._id,
    doctorId: users.doctor._id,
    patientProfileId: profile._id,
    reasonForVisit: randomReasons[Math.floor(Math.random() * randomReasons.length)],
    passMedicalHistory: "Không có tiền sử bệnh nghiêm trọng",
    diagnosis: randomDiagnoses[Math.floor(Math.random() * randomDiagnoses.length)],
    conclusion: "Nghỉ ngơi, uống thuốc đúng giờ",
    prescriptionId: prescription?._id ?? null,
    status: "pending",
    paymentStatus: "unpaid",
    paymentMethod: null,
    price: 300000,
    scheduledDate: new Date("2025-06-27"),
    scheduledTimeSlot: "08:30 - 09:00",
  });

  console.log("MedicalExamination seeded!");
  return exam;
};

export const seedWorkSchedule = async (doctor: any, examination: any) => {
  const allTimeSlots = await TimeSlot.find();
  if (!allTimeSlots || allTimeSlots.length < 6) {
    console.warn("Not enough time slots in DB to seed schedules.");
    return;
  }

  const date = new Date("2025-06-27");
  date.setHours(0, 0, 0, 0);

  const slotToBook = allTimeSlots.find(
    (slot) => slot.timeRange === "08:30-09:00"
  );
  if (!slotToBook) {
    throw new Error("TimeSlot '08:30 - 09:00' not found!");
  }

  const slots = [
    {
      timeSlotId: slotToBook._id,
      status: "booked",
      examinationId: examination._id,
      examinationType: "OFFLINE",
    },
    ...allTimeSlots.slice(1, 3).map((slot) => ({
      timeSlotId: slot._id,
      status: "available",
      examinationId: null,
      examinationType: "ONLINE",
    })),
  ];

  await WorkSchedule.create({
    doctorId: doctor._id,
    date,
    slots,
  });

  console.log("WorkSchedule seeded for doctor:", doctor._id);
};
