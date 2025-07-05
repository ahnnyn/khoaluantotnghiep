// src/routes/user.routes.ts
import express, { Express } from "express";
import authjwt from "middleware/auth.jwt";

import {
  loginAPI,
  postLogout,
  getViewUserByID,
  putUpdateUser,
  putUpdatePassword,
  postCreateUser,
} from "controllers/user/user.auth.controller";

import { ACCOUNT_ROLE } from "config/constants"; // Import ACCOUNT_ROLE nếu cần

const router = express.Router();

const userRoutes = (app: Express) => {
  //Route public (Không cần auth)
  router.post("/auth/login", loginAPI);

  //Gắn auth cho các route còn lại
  // Tạo middleware cho các role được phép
  const authorizeUser= authjwt([
    ACCOUNT_ROLE.ADMIN,
    ACCOUNT_ROLE.DOCTOR,
    ACCOUNT_ROLE.PATIENT,
  ]);

  // Gắn middleware vào router (KHÔNG gắn vào app)
  router.use(authorizeUser);

  router.post("/auth/logout", postLogout);
  router.post("/create-user", postCreateUser);
  router.get("/view-user/:id", getViewUserByID);
  router.put("/update-user", putUpdateUser);
  router.put("/update-account", putUpdatePassword);
  // router.post("/handle-create-user", fileUploadMiddleware("avatar"), postCreateUser);
  // router.post("/handle-delete-user/:id", postDeleteUser);
  // router.get("/handle-view-detail-user/:id", getViewUser);
  // router.post("/handle-update-user", postUpdateUser);

  // Gắn vào app với prefix
  app.use("/api/user", router);
};

export default userRoutes;
