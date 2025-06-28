// src/routes/admin.routes.ts
import { getDepartment, getPosition } from 'controllers/admin/admin.controller';
import express, { Express } from 'express';
import authjwt from 'middleware/auth.jwt';
import { ACCOUNT_ROLE } from 'config/constants'; //

const router = express.Router();

const adminRoutes = (app: Express) => {
  // Gắn middleware yêu cầu phải là admin
  router.use(authjwt([ACCOUNT_ROLE.ADMIN]));

 // Các route dưới đây chỉ gọi được nếu token hợp lệ và role là ADMIN
  router.get('/get-all-departments', getDepartment);
  router.get('/get-all-positions', getPosition);
  
  //Mount vào app
  app.use('/api/admin', router);
};

export default adminRoutes;
