// seed.ts
import Role from 'models/Roles';
import Position from 'models/Position';
import Department from 'models/Departments';
import User from 'models/Users';
import PatientProfile from 'models/PatientProfile';
import MedicalExamination from 'models/MedicalExaminations';
import Medication from 'models/Medication';
import Prescription from 'models/Prescription';
import bcrypt from 'bcrypt';
import WorkSchedule from 'models/WorkSchedules';
import PrescriptionItem from 'models/PrescriptionItem';
import TimeSlot from 'models/TimeSlot';

export const seedVaiTro = async () => {
  const existing = await Role.findOne({ roleName: 'admin' });
  if (!existing) {
    await Role.create([
      { roleName: 'admin', description: 'Quản trị viên hệ thống', status: 'active' },
      { roleName: 'doctor', description: 'Người dùng là bác sĩ', status: 'active' },
      { roleName: 'patient', description: 'Người dùng là bệnh nhân', status: 'active' }
    ]);
    console.log('VaiTro seeded!');
  } else {
    console.log('VaiTro already exists');
  }
};

export const seedChuVu = async () => {
  await Position.create([
    { name: 'Trưởng khoa', description: 'Chịu trách nhiệm quản lý toàn bộ khoa', status: 'active' },
    { name: 'Bác sĩ điều trị', description: 'Thăm khám và điều trị bệnh nhân', status: 'active' }
  ]);
  console.log('ChuVu seeded!');
};

export const seedDepartment = async () => {
  await Department.create([
    { name: 'Khoa Nội', image: 'noikhoa.jpg', description: 'Chuyên điều trị bệnh nội khoa', status: 'active' },
    { name: 'Khoa Nhi', image: 'khoanhi.jpg', description: 'Chăm sóc và điều trị cho trẻ em', status: 'active' }
  ]);
  console.log('Department seeded!');
};

export const seedUser = async () => {
  const roles = await Role.find();
  const positions = await Position.find();
  const departments = await Department.find();

  const hashedDoctorPassword = await bcrypt.hash('123456', 10);
  const hashedPatientPassword = await bcrypt.hash('123456', 10);
  const hashedAdminPassword = await bcrypt.hash('admin123', 10); // ✅ mật khẩu riêng

  const doctor = await User.create({
    fullName: 'Nguyễn Văn Bác Sĩ',
    gender: true,
    dateOfBirth: new Date('1980-01-01'),
    phone: '0123456789',
    email: 'doctor@example.com',
    address: 'Hà Nội',
    username: 'doctor01',
    password: hashedDoctorPassword,
    accountType: 'SYSTEM',
    roleId: roles.find(r => r.roleName === 'doctor')?._id,
    positionId: [positions[1]._id],
    departmentId: [departments[0]._id]
  });

  const patient = await User.create({
    fullName: 'Trần Anh Minh',
    gender: false,
    dateOfBirth: new Date('2000-01-01'),
    phone: '0987654321',
    email: 'patient@example.com',
    address: 'TP.HCM',
    username: 'patient01',
    password: hashedPatientPassword,
    accountType: 'SYSTEM',
    roleId: roles.find(r => r.roleName === 'patient')?._id
  });

  const admin = await User.create({
    fullName: 'Admin Quản Trị',
    gender: true,
    dateOfBirth: new Date('1990-01-01'),
    phone: '0111222333',
    email: 'admin@example.com',
    address: 'Đà Nẵng',
    username: 'admin01',
    password: hashedAdminPassword,
    accountType: 'SYSTEM',
    roleId: roles.find(r => r.roleName === 'admin')?._id
  });

  console.log('User seeded!');
  return { doctor, patient, admin, department: departments[0] };
};


export const seedPatientProfile = async (patient: any) => {
  const profile = await PatientProfile.create({
    patientId: patient._id,
    fullName: patient.fullName,
    dateOfBirth: patient.dateOfBirth,
    phoneNumber: patient.phone,
    gender: 'Nữ',
    occupation: 'Sinh viên',
    identityNumber: '123456789',
    email: patient.email,
    ethnicity: 'Kinh',
    address: {
      province: 'Hà Nội',
      district: 'Đống Đa',
      ward: 'Phường Láng Hạ',
      streetDetail: 'Số 123 phố Láng Hạ'
    }
  });
  console.log('PatientProfile seeded!');
  return profile;
};



export const seedMedication = async () => {
  const meds = await Medication.create([
    { name: 'Paracetamol', unit: 'viên', price: 2000 },
    { name: 'Amoxicillin', unit: 'viên', price: 3000 }
  ]);
  console.log('Medication seeded!');
  return meds;
};

export const seedPrescription = async (
  examId: any,
  meds: any[]
): Promise<typeof Prescription.prototype> => {
  // Tạo Prescription trước, chưa gồm item
  const prescription = await Prescription.create({
    medicalExaminationId: examId,
    items: [] // ban đầu rỗng
  });

  // Tạo danh sách PrescriptionItem và gán prescriptionId cho từng item
  const items = await PrescriptionItem.insertMany([
    {
      medication: meds[0]._id,
      dosage: '500mg',
      frequency: '3 lần/ngày',
      duration: '5 ngày',
      quantity: 10,
      instructions: 'Uống sau ăn'
    },
    {
      medication: meds[1]._id,
      dosage: '250mg',
      frequency: '2 lần/ngày',
      duration: '7 ngày',
      quantity: 14,
      instructions: 'Uống trước ăn'
    }
  ]);

  // Cập nhật prescription.items với ObjectId của item
  prescription.items = items.map(item => item._id);
  await prescription.save();

  console.log('Prescription & PrescriptionItems seeded!');
  return prescription;
};



export const seedMedicalExamination = async (
  users: { patient: any; doctor: any },
  prescription: any,
  profile: any
) => {
  const exam = await MedicalExamination.create({
    patientId: users.patient._id,
    doctorId: users.doctor._id,
    patientProfileId: profile._id,
    reasonForVisit: 'Khám đau đầu, chóng mặt',
    passMedicalHistory: 'Không có tiền sử bệnh nghiêm trọng',
    diagnosis: 'Thiếu máu não',
    conclusion: 'Nghỉ ngơi, uống thuốc đúng giờ',
    prescriptionId: prescription?._id ?? null, // an toàn nếu null
    status: 'pending',
    paymentStatus: 'unpaid',
    paymentMethod: null,
    price: 300000,
    examinationTime: new Date()
  });

  console.log('MedicalExamination seeded!');
  return exam;
};

export const seedWorkSchedule = async (doctor: any, examination: any) => {
  const randomInt = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const allTimeSlots = await TimeSlot.find();
  if (!allTimeSlots || allTimeSlots.length < 6) {
    console.warn('Not enough time slots in DB to seed schedules.');
    return;
  }

  const schedules = [];

  for (let i = 1; i <= 5; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    date.setHours(0, 0, 0, 0);

    const slotCount = randomInt(2, 4);
    const selectedSlotIndexes = new Set<number>();
    while (selectedSlotIndexes.size < slotCount) {
      selectedSlotIndexes.add(randomInt(0, allTimeSlots.length - 1));
    }

    const slots = Array.from(selectedSlotIndexes).map((index, j) => {
      const slot = allTimeSlots[index];
      return {
        timeSlotId: slot._id,
        status: j === 0 && i === 1 ? 'booked' : 'available',
        examinationId: j === 0 && i === 1 ? examination?._id : null,
        examinationType: j % 2 === 0 ? 'OFFLINE' : 'ONLINE',
      };
    });

    schedules.push({
      doctorId: doctor._id,
      date,
      slots,
    });
  }

  await WorkSchedule.insertMany(schedules);
console.log("==> Seeding WorkSchedule for doctor:", doctor._id);
console.log("==> TimeSlots found:", allTimeSlots.length);
console.log("==> WorkSchedule sample:", JSON.stringify(schedules[0], null, 2));
};