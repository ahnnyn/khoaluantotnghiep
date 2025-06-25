import { NextFunction, Request, Response } from "express";
import bcrypt from 'bcrypt'; // sử dụng bcrypt để mã hóa mật khẩu
import jwt from 'jsonwebtoken'
import 'dotenv/config'; // sử dụng dotenv để quản lý biến môi trường
import { ACCOUNT_TYPE } from "config/constants";
import { getListDepartment, getListPosition } from "services/admin/admin.services";

// Xem thông tin user
const getDepartment = async (req: Request, res: Response) => {
  try {
    const departments = await getListDepartment(); // Lấy danh sách phòng ban từ service

    res.status(200).json({data: departments}); // Gửi response về client
  } catch (error) {
    console.error("Error viewing user:", error);
    res.status(500).send("Internal Server Error");
  }
};

const getPosition = async (req: Request, res: Response) => {
  try {
    const positions = await getListPosition(); // Lấy danh sách vị trí từ service
    res.status(200).json({data: positions}); // Gửi response về client
  }catch (error) {
    console.error("Error viewing user:", error);
    res.status(500).send("Internal Server Error");
    }
}



export {
    getDepartment,
    getPosition,
};
