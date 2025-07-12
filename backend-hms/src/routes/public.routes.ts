import express, { Express } from 'express';
import { getDoctorByDeptID, getDepartment, getDeptByID, getAllDoctors } from '../controllers/common/common.controller';
import { getWorkScheduleByDoctor } from 'controllers/doctor/doctor.controller';

const router = express.Router();

const publicRoutes = (app: Express) => {
  router.get('/get-doctors-by-deptID/:id', getDoctorByDeptID);
  router.get('/get-all-departments', getDepartment);
  router.get('/get-department/:id', getDeptByID); 
  router.get('/get-work-schedule-by-doctorID/:id', getWorkScheduleByDoctor)
  router.get('/get-all-doctors', getAllDoctors);
  app.use('/api/public', router);
};

export default publicRoutes;
