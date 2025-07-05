// src/routes/admin.routes.ts
import express, { Express } from "express";
import {
  postUploadMultipleFilesApi,
  postUploadSingleFileApi,
} from "controllers/upload/file.upload.controllers";
import authjwt from "middleware/auth.jwt";
import { ACCOUNT_ROLE } from "config/constants";

const router = express.Router();

const uploadRoutes = (app: Express) => {
  // Tạo middleware cho các role được phép
  const authorizeUpload = authjwt([
    ACCOUNT_ROLE.ADMIN,
    ACCOUNT_ROLE.DOCTOR,
    ACCOUNT_ROLE.PATIENT,
  ]);

  // Gắn middleware vào router (KHÔNG gắn vào app)
  router.use(authorizeUpload);

  // Định nghĩa các route upload
  router.post("/single", postUploadSingleFileApi);
  router.post("/multiple", postUploadMultipleFilesApi);

  // Gắn router vào app
  app.use("/api/upload-file", router); // ✅ đúng
};

export default uploadRoutes;
