import express, { Express } from 'express';
import { getAllDoctors } from 'controllers/patient/patient.controller';
import { getDepartment } from 'controllers/doctor/doctor.controller';

const router = express.Router();

const publicRoutes = (app: Express) => {
  router.get('/get-all-doctors', getAllDoctors);
  router.get('/get-all-departments', getDepartment);

  app.use('/api/public', router);
};

export default publicRoutes;
