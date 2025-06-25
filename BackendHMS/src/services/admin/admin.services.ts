import getConnection from "config/connect.mongo";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { ACCOUNT_TYPE } from "config/constants";
import Department from "models/Departments";
import Position from "models/Position";


// Mã hóa mật khẩu
const getListDepartment = async () => {
    return await Department.find().lean();
};

const getListPosition = async () => {
    return await Position.find().lean();
}


export {
    getListDepartment,
    getListPosition
};
