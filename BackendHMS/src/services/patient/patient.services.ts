import getConnection from "config/connect.mongo";
import bcrypt from "bcrypt"; // sử dụng bcrypt để mã hóa mật khẩu
import jwt from "jsonwebtoken";
import "dotenv/config"; // sử dụng dotenv để quản lý biến môi trường
import { ACCOUNT_TYPE } from "config/constants";
import User from "models/Users";