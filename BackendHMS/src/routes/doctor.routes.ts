// src/routes/doctor.routes.ts
import { getDepartment, getMedicalExaminationById, getMedicalExaminationsByDoctor, getMedicalExaminationsByPatient, getPosition, getTimeSlots, getWorkScheduleByDates, getWorkScheduleByDoctor, postCreateWorkSchedule, updateMedicalExaminationResult, updateMedicalExaminationStatus } from 'controllers/doctor/doctor.controller';
import express, { Express } from 'express';
import authjwt from 'middleware/auth.jwt';

const router = express.Router();

const doctorRoutes = (app: Express) => {
  router.use(authjwt);

  // Thêm route bác sĩ ở đây
  router.get('/view-examination-by-patient/:id', getMedicalExaminationsByPatient);
  router.get('/view-examination-by-doctor/:id', getMedicalExaminationsByDoctor);
  router.get('view-examination/:id', getMedicalExaminationById); // Lấy thông tin khám bệnh theo ID
  router.put('/update-examination-status', updateMedicalExaminationStatus); // Cập nhật trạng thái khám bệnh
  router.put('/update-examination-result', updateMedicalExaminationResult); // Cập nhật kết quả khám bệnh
  router.get('/view-work-schedule/:doctorId', getWorkScheduleByDoctor); // Lấy lịch làm việc theo bác sĩ
  router.get('/view-work-schedule/:doctorId/:date', getWorkScheduleByDates); // Lấy lịch làm việc theo bác sĩ và ngày
  router.post('/create-work-schedule', postCreateWorkSchedule);
  router.get('/get-all-departments', getDepartment);
  router.get('/get-all-positions', getPosition);
  router.get('/get/time-slots', getTimeSlots); // Lấy danh sách khung giờ


  app.use('/api/doctor', router);
};

export default doctorRoutes;
