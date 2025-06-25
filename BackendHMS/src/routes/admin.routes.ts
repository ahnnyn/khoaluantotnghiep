// src/routes/admin.routes.ts
import { getDepartment, getPosition } from 'controllers/admin/admin.controller';
import express, { Express } from 'express';
import authjwt from 'middleware/auth.jwt';

const router = express.Router();

const adminRoutes = (app: Express) => {
  // Gắn middleware nếu cần
  router.use(authjwt);

  // Thêm route admin ở đây

  router.get('/get-all-departments', getDepartment);
  router.get('/get-all-positions', getPosition);
  app.use('/api/admin', router);
};

export default adminRoutes;
