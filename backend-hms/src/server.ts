// server.ts
import express from "express";
import "dotenv/config";
import cors from "cors";
import connection from "./config/connect.mongo";
import path from "path";
import webRoutes from "routes/web";
import fileUpload from "express-fileupload";

import {
// seedVaiTro,
// seedChuVu,
// seedDepartment,
// seedMultipleUsers,
// seedMultiplePatientProfiles,
// seedMedicalExamination,
// seedMedication,
// seedPrescription,
// seedWorkSchedule,
// seedAdditionalUsers,
// seedPriceList
seedTopics,
seedArticles
} from "./seed";

// Models
import "models/Users";
import "models/Roles";
import "models/Position";
import "models/Departments";
import "models/PatientProfile";
import "models/MedicalExaminations";
import "models/Medication";
import "models/Prescription";
import "models/PrescriptionItem";
import "models/WorkSchedules";
import "models/Payments";
import ArticleTopic from "./models/ArticleTopic";
import Article from "./models/Article";

import TimeSlot from "./models/TimeSlot";
import MedicalExamination from "./models/MedicalExaminations";

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(fileUpload());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use("/public", express.static(path.join(process.cwd(), "public")));

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
webRoutes(app);
app.get("/", (_req, res) => {
  res.send("Server is running!");
});

connection().then(async () => {
  // seedTopics();
  // seedArticles();
  // Bước 1: Vai trò, chức vụ, khoa
  //   await seedVaiTro();
  //   await seedChuVu();
  //   await seedDepartment();
  //   await seedPriceList(); // 👈 Thêm dòng này
  // await seedAdditionalUsers();

  //   // Bước 2: Người dùng
  //   const { doctorUsers, patientUsers } = await seedMultipleUsers();

  //   // Bước 3: Hồ sơ bệnh nhân
  //   const patientProfiles = await seedMultiplePatientProfiles(patientUsers);

  //   // Bước 4: TimeSlot
  //   const existed = await TimeSlot.findOne();
  //   if (!existed) {
  //     await TimeSlot.insertMany([
  //       { timeRange: "07:30-08:00", start: "07:30", end: "08:00" },
  //       { timeRange: "08:00-08:30", start: "08:00", end: "08:30" },
  //       { timeRange: "08:30-09:00", start: "08:30", end: "09:00" },
  //       { timeRange: "09:00-09:30", start: "09:00", end: "09:30" },
  //       { timeRange: "09:30-10:00", start: "09:30", end: "10:00" },
  //       { timeRange: "10:00-10:30", start: "10:00", end: "10:30" },
  //       { timeRange: "10:30-11:00", start: "10:30", end: "11:00" },
  //       { timeRange: "11:00-11:30", start: "11:00", end: "11:30" },
  //       { timeRange: "13:00-13:30", start: "13:00", end: "13:30" },
  //       { timeRange: "13:30-14:00", start: "13:30", end: "14:00" },
  //       { timeRange: "14:00-14:30", start: "14:00", end: "14:30" },
  //       { timeRange: "14:30-15:00", start: "14:30", end: "15:00" },
  //       { timeRange: "15:00-15:30", start: "15:00", end: "15:30" },
  //       { timeRange: "15:30-16:00", start: "15:30", end: "16:00" },
  //       { timeRange: "16:00-16:30", start: "16:00", end: "16:30" },
  //       { timeRange: "16:30-17:00", start: "16:30", end: "17:00" },
  //     ]);
  //     console.log("Time slots seeded!");
  //   }

  //   // Bước 5: Thuốc
  //   const meds = await seedMedication();

  //   // Bước 6: Tạo phiếu khám → đơn thuốc → cập nhật phiếu → lịch làm việc
  //   for (let i = 0; i < Math.min(doctorUsers.length, patientUsers.length); i++) {
  //     const exam = await seedMedicalExamination(
  //       { doctor: doctorUsers[i], patient: patientUsers[i] },
  //       null, // chưa có prescription
  //       patientProfiles[i]
  //     );

  //     const prescription = await seedPrescription(exam._id, meds);

  //     // cập nhật prescriptionId vào phiếu khám
  //     await MedicalExamination.findByIdAndUpdate(exam._id, {
  //       prescriptionId: prescription._id,
  //     });

  //     // tạo lịch làm việc
  //     await seedWorkSchedule(doctorUsers[i], exam);
  //   }

  //   console.log("All data seeded!");

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
