import getConnection from "config/connect.mongo";
import "dotenv/config"; // sử dụng dotenv để quản lý biến môi trườn
import mongoose from "mongoose";
import Department from "models/Departments";
import Role from "models/Roles";
import TimeSlot from "models/TimeSlot";
import User from "models/Users";
import PriceList from "models/PriceList";
import ArticleTopic from "models/ArticleTopic";
import Article from "models/Article";

const getListDepartment = async () => {
  return await Department.find().lean();
};

const getDepartmentById = async (id: string) => {
  const department = await Department.findById(id).lean();
  if (!department) {
    throw new Error(`Department with id ${id} not found`);
  }
  return department;
};

const getAllTimeSlots = async () => {
  return await TimeSlot.find().lean();
};

const getDoctorsByDepartmentID = async (departmentId: string) => {
  if (!mongoose.Types.ObjectId.isValid(departmentId)) {
    throw new Error("Invalid department ID");
  }

  const doctorRole = await Role.findOne({ roleName: "DOCTOR" });
  if (!doctorRole) throw new Error("Role 'doctor' not found");

  return await User.find({
    departmentId: { $in: [new mongoose.Types.ObjectId(departmentId)] },
    roleId: doctorRole._id,
  })
    .populate("departmentId")
    .populate("roleId")
    .populate("positionId");
};

const getListDoctor = async () => {
  const doctorRole = await Role.findOne({ roleName: "DOCTOR" });

  if (!doctorRole) {
    throw new Error('Role "doctor" not found');
  }

  const doctors = await User.find({
    roleId: doctorRole._id,
    status: "active",
  })
    .select("-password")
    .populate("roleId")
    .populate("positionId")
    .populate("departmentId");

  return doctors;
};

const getPriceList = async () => {
  const priceList = await PriceList.find()
    .populate("departmentId")
    .populate("doctorId")
    .lean();

  return priceList;
};

const getPriceListByDepartmentId = async (departmentId: string) => {
  const priceList = await PriceList.find({
    departmentId,
    doctorId: { $exists: false },
    active: true,
  })
    .sort({ effectiveDate: -1 })
    .populate("departmentId", "name description")
    .lean();

  return priceList;
};

const getPriceListByDoctorId = async (doctorId: string) => {
  if (!mongoose.Types.ObjectId.isValid(doctorId)) {
    throw new Error("Invalid doctor ID");
  }
  const priceList = await PriceList.find({
    doctorId: new mongoose.Types.ObjectId(doctorId),
  })
    .populate("departmentId")
    .populate("doctorId")
    .lean();
  return priceList;
};

const getArticle = async () => {
  getConnection();
  const articles = await Article.find()
    .populate("author", "fullName")
    .populate("relatedDoctorIds", "fullName")
    .populate("relatedDepartmentId", "name")
    .populate("topicId", "name")
    .lean();
  return articles;
};
export {
  getListDepartment,
  getAllTimeSlots,
  getDoctorsByDepartmentID,
  getDepartmentById,
  getListDoctor,
  getPriceList,
  getPriceListByDepartmentId,
  getPriceListByDoctorId,
  getArticle,
};
