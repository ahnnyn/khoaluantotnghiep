// src/routes/patient.routes.ts
import express, { Express } from 'express';
import authjwt from 'middleware/auth.jwt';

const router = express.Router();

const patientRoutes = (app: Express) => {
  router.use(authjwt);

  // Thêm route bệnh nhân ở đây

  app.use('/api/patient', router);
};

export default patientRoutes;
