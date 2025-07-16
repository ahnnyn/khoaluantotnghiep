import express, { Express } from "express";
import authjwt from "middleware/auth.jwt";
import { ACCOUNT_ROLE } from "config/constants";
import {
  handleCreatePayment,
  handleCreateVnPayUrl,
} from "controllers/payment/payment.controller";
const router = express.Router();

const patientRoutes = (app: Express) => {
  router.use(authjwt([ACCOUNT_ROLE.PATIENT]));

  router.post("/create-payment", handleCreatePayment);
  router.post("/create-url", handleCreateVnPayUrl);
  app.use("/api/payment", router);
};

export default patientRoutes;
