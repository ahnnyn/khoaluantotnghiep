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
import PriceList from "models/PriceList";
import ArticleTopic from "models/ArticleTopic";
import Article from "models/Article";

export const seedVaiTro = async () => {
  const existing = await Role.findOne({ roleName: "ADMIN" });
  if (!existing) {
    await Role.create([
      {
        roleName: "ADMIN",
        description: "Quản trị viên hệ thống",
        status: "active",
      },
      {
        roleName: "DOCTOR",
        description: "Bác sĩ điều trị",
        status: "active",
      },
      {
        roleName: "PATIENT",
        description: "Người dùng là bệnh nhân",
        status: "active",
      },
      {
        roleName: "SPECIALIST",
        description: "Chuyên viên tư vấn / hỗ trợ",
        status: "active",
      },
      {
        roleName: "COORDINATOR",
        description: "Điều phối viên lịch khám",
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
  const existing = await Department.findOne({ name: "Khoa Nội" });
  if (existing) {
    console.log("Departments already seeded.");
    return;
  }

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
    {
      name: "Khoa Ngoại",
      image: "khoangoai.jpg",
      description: "Phẫu thuật và điều trị bệnh ngoại khoa",
      status: "active",
    },
    {
      name: "Khoa Tai Mũi Họng",
      image: "khoataimuihong.jpg",
      description: "Chẩn đoán và điều trị bệnh tai, mũi, họng",
      status: "active",
    },
    {
      name: "Khoa Da Liễu",
      image: "khoadalieu.jpg",
      description: "Điều trị các bệnh về da liễu",
      status: "active",
    },
    {
      name: "Khoa Mắt",
      image: "khoamat.jpg",
      description: "Khám và điều trị bệnh về mắt",
      status: "active",
    },
    {
      name: "Khoa Răng Hàm Mặt",
      image: "khoaranghammat.jpg",
      description: "Khám chữa bệnh răng miệng và hàm mặt",
      status: "active",
    },
    {
      name: "Khoa Sản",
      image: "khoasan.jpg",
      description: "Chăm sóc sức khỏe sinh sản và phụ nữ",
      status: "active",
    },
  ]);

  console.log("Departments seeded!");
};

export const seedMultipleUsers = async () => {
  const roles = await Role.find();
  const positions = await Position.find();
  const departments = await Department.find();

  const hashedDoctorPassword = await bcrypt.hash("Healio@2025", 10);
  const hashedPatientPassword = await bcrypt.hash("Healio@2025", 10);

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
        roleId: roles.find((r) => r.roleName === "DOCTOR")?._id,
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
        roleId: roles.find((r) => r.roleName === "PATIENT")?._id,
      })
    )
  );

  console.log("Multiple Users seeded!");
  return { doctorUsers, patientUsers };
};

export const seedAdditionalUsers = async () => {
  const roles = await Role.find();
  const hashedPassword = await bcrypt.hash("Healio@2025", 10);

  const roleMap = {
    ADMIN: roles.find((r) => r.roleName === "ADMIN")?._id,
    SPECIALIST: roles.find((r) => r.roleName === "SPECIALIST")?._id,
    COORDINATOR: roles.find((r) => r.roleName === "COORDINATOR")?._id,
  };

  const users = [
    {
      fullName: "Admin Healio",
      username: "admin01",
      email: "admin@example.com",
      roleId: roleMap.ADMIN,
    },
    {
      fullName: "Nguyễn Thị Chuyên Viên",
      username: "specialist01",
      email: "specialist@example.com",
      roleId: roleMap.SPECIALIST,
    },
    {
      fullName: "Trần Văn Điều Phối",
      username: "coordinator01",
      email: "coordinator@example.com",
      roleId: roleMap.COORDINATOR,
    },
  ];

  await Promise.all(
    users.map((u, index) =>
      User.create({
        ...u,
        gender: index % 2 === 0,
        dateOfBirth: new Date("1995-01-01"),
        phone: `090112233${index}`,
        address: "TP.HCM",
        password: hashedPassword,
        accountType: "SYSTEM",
      })
    )
  );

  console.log("Admin + Specialist + Coordinator users seeded!");
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

export const seedPriceList = async () => {
  const departments = await Department.find();

  const dataToSeed: {
    departmentName: string;
    examinationType: "ONLINE" | "OFFLINE";
    price: number;
    description: string;
  }[] = [
    // Internal Medicine
    {
      departmentName: "Khoa Nội",
      examinationType: "OFFLINE",
      price: 200000,
      description: "Khám trực tiếp tại cơ sở - Nội khoa",
    },
    {
      departmentName: "Khoa Nội",
      examinationType: "ONLINE",
      price: 150000,
      description: "Khám online qua video call - Nội khoa",
    },

    // Pediatrics
    {
      departmentName: "Khoa Nhi",
      examinationType: "OFFLINE",
      price: 220000,
      description: "Khám trực tiếp cho trẻ em",
    },
    {
      departmentName: "Khoa Nhi",
      examinationType: "ONLINE",
      price: 170000,
      description: "Khám online cho trẻ em",
    },

    // Surgery
    {
      departmentName: "Khoa Ngoại",
      examinationType: "OFFLINE",
      price: 250000,
      description: "Khám và tư vấn phẫu thuật",
    },
    {
      departmentName: "Khoa Ngoại",
      examinationType: "ONLINE",
      price: 180000,
      description: "Tư vấn trước mổ, sau mổ",
    },

    // ENT
    {
      departmentName: "Khoa Tai Mũi Họng",
      examinationType: "OFFLINE",
      price: 240000,
      description: "Khám các vấn đề về tai mũi họng",
    },
    {
      departmentName: "Khoa Tai Mũi Họng",
      examinationType: "ONLINE",
      price: 170000,
      description: "Tư vấn triệu chứng TMH",
    },

    // Dermatology
    {
      departmentName: "Khoa Da Liễu",
      examinationType: "OFFLINE",
      price: 230000,
      description: "Khám da liễu trực tiếp",
    },
    {
      departmentName: "Khoa Da Liễu",
      examinationType: "ONLINE",
      price: 160000,
      description: "Tư vấn da liễu từ xa",
    },

    // Ophthalmology
    {
      departmentName: "Khoa Mắt",
      examinationType: "OFFLINE",
      price: 210000,
      description: "Khám mắt tại cơ sở",
    },
    {
      departmentName: "Khoa Mắt",
      examinationType: "ONLINE",
      price: 150000,
      description: "Tư vấn mắt online",
    },

    // Dental
    {
      departmentName: "Khoa Răng Hàm Mặt",
      examinationType: "OFFLINE",
      price: 260000,
      description: "Khám nha khoa, hàm mặt",
    },
    {
      departmentName: "Khoa Răng Hàm Mặt",
      examinationType: "ONLINE",
      price: 190000,
      description: "Tư vấn răng miệng từ xa",
    },

    // Obstetrics
    {
      departmentName: "Khoa Sản",
      examinationType: "OFFLINE",
      price: 270000,
      description: "Khám thai, sản phụ khoa",
    },
    {
      departmentName: "Khoa Sản",
      examinationType: "ONLINE",
      price: 200000,
      description: "Tư vấn sản phụ khoa online",
    },
  ];

  for (const item of dataToSeed) {
    const department = departments.find((d) => d.name === item.departmentName);
    if (!department) {
      console.warn(`Department not found: ${item.departmentName}`);
      continue;
    }

    const exists = await PriceList.findOne({
      departmentId: department._id,
      examinationType: item.examinationType,
    });

    if (exists) {
      console.log(
        `Price already exists: ${item.departmentName} - ${item.examinationType}`
      );
      continue;
    }

    await PriceList.create({
      departmentId: department._id,
      examinationType: item.examinationType,
      price: item.price,
      description: item.description,
    });

    console.log(`Seeded: ${item.departmentName} - ${item.examinationType}`);
  }

  console.log("PriceList seeding completed!");
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

const randomReasons = ["Khám ho sốt", "Khám đau đầu", "Khám đau bụng"];
const randomDiagnoses = ["Cảm cúm", "Thiếu máu não", "Viêm dạ dày"];

export const seedMedicalExamination = async (
  users: { patient: any; doctor: any },
  prescription: any,
  profile: any
) => {
  const exam = await MedicalExamination.create({
    patientId: users.patient._id,
    doctorId: users.doctor._id,
    patientProfileId: profile._id,
    reasonForVisit:
      randomReasons[Math.floor(Math.random() * randomReasons.length)],
    passMedicalHistory: "Không có tiền sử bệnh nghiêm trọng",
    diagnosis:
      randomDiagnoses[Math.floor(Math.random() * randomDiagnoses.length)],
    conclusion: "Nghỉ ngơi, uống thuốc đúng giờ",
    prescriptionId: prescription?._id ?? null,
    status: "pending",
    paymentStatus: "unpaid",
    paymentMethod: null,
    price: 300000,
    scheduledDate: new Date("2025-07-22"),
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

  const date = new Date("2025-07-22");
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

export async function seedTopics() {
  const topics = [
    {
      name: "Da liễu",
      slug: "da-lieu",
      description: "Các bài viết liên quan đến chăm sóc và điều trị da.",
      image: "/topics/da-lieu.jpg",
    },
    {
      name: "Nhi khoa",
      slug: "nhi-khoa",
      description: "Thông tin sức khỏe trẻ em.",
      image: "/topics/nhi-khoa.jpg",
    },
    {
      name: "Tin tức y tế",
      slug: "tin-tuc-y-te",
      description: "Cập nhật tình hình ngành y.",
    },
    {
      name: "Chăm sóc tại nhà",
      slug: "cham-soc-tai-nha",
      description: "Hướng dẫn chăm sóc bệnh nhân tại nhà.",
    },
    {
      name: "Phòng ngừa bệnh",
      slug: "phong-ngua-benh",
      description: "Các mẹo và hướng dẫn phòng bệnh.",
    },
  ];

  await ArticleTopic.insertMany(topics);
  console.log("Seeded Article Topics");
}

export async function seedArticles() {
  const [daLieu, nhiKhoa, yTe, chamSoc, phongNgu] = await Promise.all([
    ArticleTopic.findOne({ slug: "da-lieu" }),
    ArticleTopic.findOne({ slug: "nhi-khoa" }),
    ArticleTopic.findOne({ slug: "tin-tuc-y-te" }),
    ArticleTopic.findOne({ slug: "cham-soc-tai-nha" }),
    ArticleTopic.findOne({ slug: "phong-ngua-benh" }),
  ]);

  const articles = [
    {
      title: "Bí quyết trị mụn hiệu quả tại nhà",
      slug: "tri-mun-tai-nha",
      content: "<p>Mụn là vấn đề phổ biến...</p>",
      summary: "Tổng hợp các cách trị mụn đơn giản mà hiệu quả.",
      topicId: daLieu?._id,
      category: "Tư vấn",
      tags: ["mụn", "da liễu"],
      thumbnail: "cach-tri-mun.jpg",
    },
    {
      title: "Khi nào trẻ cần khám bác sĩ ngay?",
      slug: "trieu-chung-nguy-hiem-tre-em",
      content: "<ul><li>Sốt cao > 39°C...</li></ul>",
      summary: "Cảnh báo các dấu hiệu ở trẻ em không nên chủ quan.",
      topicId: nhiKhoa?._id,
      category: "Tin tức",
      tags: ["nhi", "khám bệnh"],
      thumbnail: "dau-hieu-nguy-hiem-o-tre-em.jpg",
    },
    {
      title: "Cập nhật vắc xin mới nhất từ Bộ Y tế",
      slug: "cap-nhat-vac-xin-moi",
      summary: "Bộ Y tế vừa đưa vào sử dụng vắc xin phòng bệnh mới.",
      content: "<p>Được khuyến nghị tiêm cho người từ 18 tuổi trở lên...</p>",
      topicId: yTe?._id,
      category: "Tin tức",
      thumbnail: "Vaccine_Cover.jpg",
    },
    {
      title: "Cách xử lý khi người thân bị cao huyết áp đột ngột",
      slug: "cao-huyet-ap-dot-ngot",
      summary: "Hướng dẫn các bước xử lý ban đầu an toàn.",
      content: "<p>Đặt người bệnh nằm nghiêng...</p>",
      topicId: chamSoc?._id,
      category: "Tư vấn",
      thumbnail: "tang-huyet-ap.jpg",
    },
    {
      title: "6 cách phòng tránh bệnh tay chân miệng",
      slug: "phong-benh-tay-chan-mieng",
      summary: "Phòng bệnh hơn chữa bệnh. Cùng tìm hiểu các biện pháp.",
      content: "<p>Giữ vệ sinh tay, tránh tiếp xúc...</p>",
      topicId: phongNgu?._id,
      category: "Blog",
      thumbnail: "phong-tay-chan-mieng.jpg",
    },
  ];

  await Article.insertMany(articles);
  console.log("Seeded Articles with topics");
}
