// src/routes/patient.routes.ts
import express, { Express } from "express";
import authjwt from "middleware/auth.jwt";
import { ACCOUNT_ROLE } from "config/constants"; // Import ACCOUNT_ROLE nếu cần
import {
  sendCancellationEmail,
  sendEmailLichKham,
} from "controllers/email/email.controller";

const router = express.Router();

const mailRoutes = (app: Express) => {
  //   router.use(authjwt([ACCOUNT_ROLE.PATIENT])); // Gắn middleware yêu cầu phải là bệnh nhân
  router.post("/confirm-appointment", sendEmailLichKham);
  router.post("/cancel-appointment", sendCancellationEmail);
  app.use("/api/email", router);
};

export default mailRoutes;
