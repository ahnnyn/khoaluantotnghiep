// server.ts
import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import connection from './config/connect.mongo';
import path from 'path';
import webRoutes from 'routes/web';
import fileUpload from 'express-fileupload';


import {
  seedVaiTro,
  seedChuVu,
  seedDepartment,
  seedUser,
  seedPatientProfile,
  seedMedicalExamination,
  seedMedication,
  seedPrescription,
  seedWorkSchedule
} from './seed'; 

// server.ts
import 'models/Users';
import 'models/Roles';
import 'models/Position';
import 'models/Departments';
import 'models/PatientProfile';
import 'models/MedicalExaminations';
import 'models/Medication';
import 'models/Prescription';
import 'models/PrescriptionItem';
import 'models/WorkSchedules';

import TimeSlot from './models/TimeSlot';

const app = express();
const PORT = process.env.PORT || 8080;

// default options
app.use(fileUpload());

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use("/public", express.static(path.join(process.cwd(), "public")));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
webRoutes(app);
app.get('/', (_req, res) => {
  res.send('Server is running!');
});

connection()
  .then(async () => {
    // await seedVaiTro();
    // await seedChuVu();
    // await seedDepartment();

    // const users = await seedUser(); // { doctor, patient, department }
    // const profile = await seedPatientProfile(users.patient);
    // const meds = await seedMedication();

    // //Bước 1: Seed Exam trước
    // const exam = await seedMedicalExamination(users, null, profile);

    // // Bước 2: Seed đơn thuốc và gắn vào phiếu khám
    // const prescription = await seedPrescription(exam._id, meds);
    // exam.prescriptionId = prescription._id;
    // await exam.save();

    // //Bước 3: Seed TimeSlot TRƯỚC
    // const timeSlots = [
    //   { timeRange: "07:30-08:00", start: "07:30", end: "08:00" },
    //   { timeRange: "08:00-08:30", start: "08:00", end: "08:30" },
    //   { timeRange: "08:30-09:00", start: "08:30", end: "09:00" },
    //   { timeRange: "09:00-09:30", start: "09:00", end: "09:30" },
    //   { timeRange: "09:30-10:00", start: "09:30", end: "10:00" },
    //   { timeRange: "10:00-10:30", start: "10:00", end: "10:30" },
    //   { timeRange: "10:30-11:00", start: "10:30", end: "11:00" },
    //   { timeRange: "11:00-11:30", start: "11:00", end: "11:30" },
    //   { timeRange: "13:00-13:30", start: "13:00", end: "13:30" },
    //   { timeRange: "13:30-14:00", start: "13:30", end: "14:00" },
    //   { timeRange: "14:00-14:30", start: "14:00", end: "14:30" },
    //   { timeRange: "14:30-15:00", start: "14:30", end: "15:00" },
    //   { timeRange: "15:00-15:30", start: "15:00", end: "15:30" },
    //   { timeRange: "15:30-16:00", start: "15:30", end: "16:00" },
    //   { timeRange: "16:00-16:30", start: "16:00", end: "16:30" },
    //   { timeRange: "16:30-17:00", start: "16:30", end: "17:00" },
    // ];

    // const existed = await TimeSlot.findOne();
    // if (!existed) {
    //   await TimeSlot.insertMany(timeSlots);
    //   console.log('Time slots seeded!');
    // } else {
    //   console.log('Time slots already exist, skipping...');
    // }

    // //Bước 4: Sau khi đã có TimeSlot thì mới seed lịch làm việc
    // await seedWorkSchedule(users.doctor, exam);

    console.log('All data seeded!');
    
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
