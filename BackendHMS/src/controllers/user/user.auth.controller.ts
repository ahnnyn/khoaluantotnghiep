import { NextFunction, Request, Response } from "express";
import {
  handleCreateUser,
  getAllUsers,
  handleDeleteUser,
  getUserByID,
  handleUpdateUser,
  handleUserLogin,
  isEmailExist,
  handleUserLogout,
  handleUpdatePassword
} from "services/user/user.services";

import "dotenv/config";
import { uploadSingleFile } from "services/upload/file.upload.services";

// ------------------------- Pages -------------------------

// Trang chủ
const getHomePage = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers(); // dùng service để tách logic
    return res.render("home", { users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).send("Internal Server Error");
  }
};

// Trang form tạo user
const getCreateUserPage = (req: Request, res: Response) => {
  return res.render("create_user.ejs");
};

// ------------------------- API -------------------------

const checkEmailExist = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await isEmailExist(email);
    if (user) {
      return res.status(200).json({ exists: true, message: "Email already exists" });
    } else {
      return res.status(200).json({ exists: false, message: "Email is available" });
    }
  } catch (error) {
    console.error("Error checking email:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Tạo user
const postCreateUser = async (req: Request, res: Response) => {
  try {
    const { fullname, email, address } = req.body;
    const file = req.file;
    const avatar = file ? file.filename : "";

    await handleCreateUser(fullname, email, address, avatar);
    return res.redirect("/");
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).send("Internal Server Error");
  }
};

// Xóa user
const postDeleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await handleDeleteUser(id);
    return res.redirect("/");
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).send("Internal Server Error");
  }
};

// Xem thông tin user
const getViewUserByID = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await getUserByID(id); // Gọi service lấy user

    if (!user) {
      res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({data: user}); // Gửi response về client
  } catch (error) {
    console.error("Error viewing user:", error);
    res.status(500).send("Internal Server Error");
  }
};


// Cập nhật user
const putUpdateUser = async (req: Request, res: Response) => {
  try {
    const {
      id,
      fullName,
      gender,
      dateOfBirth,
      phone,
      email,
      address,
      avatar, // file upload sẽ được xử lý riêng
      price,
      positionId,
      departmentId
    } = req.body;
    
    await handleUpdateUser(
      id,
      fullName,
      gender === "true" || gender === true ? true : gender === "false" || gender === false ? false : undefined,
      dateOfBirth ? new Date(dateOfBirth) : undefined,
      phone,
      email,
      address,
      avatar,
      price !== undefined && price !== null ? Number(price) : undefined,
      Array.isArray(positionId) ? positionId : positionId ? [positionId] : [],
      Array.isArray(departmentId) ? departmentId : departmentId ? [departmentId] : []
    );

    res.status(200).json({ message: "Cập nhật thông tin thành công" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Lỗi cập nhật người dùng" });
  }
};


const putUpdatePassword = async (req: Request, res: Response) => {
  try {
    const { id, oldPassword, newPassword, newUsername } = req.body;

    if (!id) {
      res.status(400).json({ message: "Thiếu ID người dùng." });
    }

    if (!oldPassword && !newPassword && !newUsername) {
      res.status(400).json({ message: "Không có thông tin cần cập nhật." });
    }

    await handleUpdatePassword(id, oldPassword, newPassword, newUsername);
    res.status(200).json({ message: "Cập nhật tài khoản thành công." });
  } catch (error: any) {
    console.error("Error:", error);
    res.status(500).json({ message: error.message || "Lỗi cập nhật tài khoản." });
  }
};


// Đăng nhập (API)
const loginAPI = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const access_token = await handleUserLogin(username, password);
    res.status(200).json({
      data: access_token,
    });
  } catch (error: any) {
    res.status(401).json({
      data: null,
      message: error.message || "Login failed",
    });
  }
};

const postLogout = async (req: Request, res: Response) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // lấy token sau "Bearer"

  if (!token) {
    res.status(401).json({ message: "Access token missing" });
  }

  try {
    const result = await handleUserLogout(token); 
    res.status(200).json(result); // { success: true, message: "Logout successful" }
  } catch (error: any) {
    res.status(401).json({ message: error.message || "Logout failed" });
  }
};
// ------------------------- Export -------------------------

export {
  getHomePage,
  getCreateUserPage,
  checkEmailExist,
  postCreateUser,
  postDeleteUser,
  getViewUserByID,
  putUpdateUser,
  putUpdatePassword,
  loginAPI,
  postLogout
};
