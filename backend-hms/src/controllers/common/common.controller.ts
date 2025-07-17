import { NextFunction, Request, Response } from "express";
import "dotenv/config"; // sử dụng dotenv để quản lý biến môi trường
import {
  getAllTimeSlots,
  getArticle,
  getDepartmentById,
  getDoctorsByDepartmentID,
  getListDepartment,
  getListDoctor,
  getPriceList,
  getPriceListByDepartmentId,
  getPriceListByDoctorId,
} from "services/common/common.services";

const getDoctorByDeptID = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const doctors = await getDoctorsByDepartmentID(id);
    res.status(200).json({ data: doctors });
    return;
  } catch (error) {
    console.error("Error fetching work schedules:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

const getDepartment = async (req: Request, res: Response) => {
  try {
    const departments = await getListDepartment(); // Lấy danh sách phòng ban từ service

    res.status(200).json({ data: departments }); // Gửi response về client
    return;
  } catch (error) {
    console.error("Error viewing user:", error);
    res.status(500).send("Internal Server Error");
    return;
  }
};

const getDeptByID = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const department = await getDepartmentById(id);
    res.status(200).json({ data: department });
    return;
  } catch (error) {
    console.error("Error fetching department:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

const getListTimeSlots = async (req: Request, res: Response) => {
  try {
    const timeSlots = await getAllTimeSlots(); // Lấy danh sách thời gian từ service
    res.status(200).json({ data: timeSlots }); // Gửi response về client
    return;
  } catch (error) {
    console.error("Error fetching time slots:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

const getAllDoctors = async (req: Request, res: Response) => {
  try {
    const doctors = await getListDoctor(); // Lấy danh sách bác sĩ từ service
    res.status(200).json({ data: doctors }); // Gửi response về client
    return;
  } catch (error) {
    console.error("Error viewing doctors:", error);
    res.status(500).send("Internal Server Error");
    return;
  }
};

const getAllPriceLists = async (req: Request, res: Response) => {
  try {
    const priceLists = await getPriceList(); // Lấy danh sách bảng giá từ service
    res.status(200).json({ data: priceLists }); // Gửi response về client
    return;
  } catch (error) {
    console.error("Error fetching price lists:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

const getPriceByDepartmentId = async (req: Request, res: Response) => {
  const { id: departmentId } = req.params;
  try {
    const priceList = await getPriceListByDepartmentId(departmentId);
    res.status(200).json({ data: priceList });
    return;
  } catch (error) {
    console.error("Error fetching price list by department ID:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

const getPriceByDoctorId = async (req: Request, res: Response) => {
  const { doctorId } = req.params;
  try {
    const priceList = await getPriceListByDoctorId(doctorId);
    res.status(200).json({ data: priceList });
    return;
  } catch (error) {
    console.error("Error fetching price list by doctor ID:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

const getListArticles = async (req: Request, res: Response) => {
  try {
    const articles = await getArticle(); // Lấy danh sách bài viết từ service
    res.status(200).json({ data: articles }); // Gửi response về client
    return;
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

export {
  getDoctorByDeptID,
  getDepartment,
  getDeptByID,
  getListTimeSlots,
  getAllDoctors,
  getAllPriceLists,
  getPriceByDepartmentId,
  getPriceByDoctorId,
  getListArticles,
};
