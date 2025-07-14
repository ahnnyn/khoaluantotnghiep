import express, { Express } from "express";
import {
  getDoctorByDeptID,
  getDepartment,
  getDeptByID,
  getAllDoctors,
  getAllPriceLists,
  getPriceByDepartmentId,
  getPriceByDoctorId,
  getListArticles,
} from "../controllers/common/common.controller";
import { getWorkScheduleByDoctor } from "controllers/doctor/doctor.controller";

const router = express.Router();

const publicRoutes = (app: Express) => {
  router.get("/get-doctors-by-deptID/:id", getDoctorByDeptID);
  router.get("/get-all-departments", getDepartment);
  router.get("/get-department/:id", getDeptByID);
  router.get("/get-work-schedule-by-doctorID/:id", getWorkScheduleByDoctor);
  router.get("/get-all-doctors", getAllDoctors);
  router.get("/get-price-list", getAllPriceLists);
  router.get("/get-price-list-by-department/:id", getPriceByDepartmentId);
  router.get("/get-price-list-by-doctor/:id", getPriceByDoctorId);
  router.get("/get-list-articles", getListArticles);
  app.use("/api/public", router);
};

export default publicRoutes;
