import { NextFunction, Request, Response } from "express";
import { handleCreateUser, getAllUsers, handleDeleteUser, getUserByID, handleUpdateUser, handleUserLogin } from "services/user/user.services";
import bcrypt from 'bcrypt'; // sử dụng bcrypt để mã hóa mật khẩu
import jwt from 'jsonwebtoken'
import 'dotenv/config'; // sử dụng dotenv để quản lý biến môi trường
import { ACCOUNT_TYPE } from "config/constants";
