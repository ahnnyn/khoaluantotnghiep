// src/routes/patient.routes.ts
import express, { Express } from 'express';
import authjwt from 'middleware/auth.jwt';
import { ACCOUNT_ROLE } from 'config/constants'; // Import ACCOUNT_ROLE nếu cần
import { getAllDoctors, postCreateMedicalExamination, putUpdatePaymentStatus } from 'controllers/patient/patient.controller';

const router = express.Router();

const patientRoutes = (app: Express) => {

  router.get('/get-all-doctors', getAllDoctors);
  router.use(authjwt([ACCOUNT_ROLE.PATIENT])); // Gắn middleware yêu cầu phải là bệnh nhân

  router.post("/create-medical-examination", postCreateMedicalExamination);
  router.put("/update-payment-status", putUpdatePaymentStatus);
  app.use('/api/patient', router);
};

export default patientRoutes;
