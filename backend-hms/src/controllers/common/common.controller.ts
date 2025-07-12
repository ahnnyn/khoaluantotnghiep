import { NextFunction, Request, Response } from "express";
import 'dotenv/config'; // sử dụng dotenv để quản lý biến môi trường
import { getAllTimeSlots, getDepartmentById, getDoctorsByDepartmentID, getListDepartment, getListDoctor} from "services/common/common.services";


const getDoctorByDeptID= async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const doctors = await getDoctorsByDepartmentID(id);
    res.status(200).json({data: doctors});
  } catch (error) {
    console.error("Error fetching work schedules:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const getDepartment = async (req: Request, res: Response) => {
  try {
    const departments = await getListDepartment(); // Lấy danh sách phòng ban từ service

    res.status(200).json({data: departments}); // Gửi response về client
  } catch (error) {
    console.error("Error viewing user:", error);
    res.status(500).send("Internal Server Error");
  }
};

const getDeptByID = async (req: Request, res: Response) => {
  const { id } = req.params;
    try {
        const department = await getDepartmentById(id);
        res.status(200).json({data: department});
    } catch (error) {
        console.error("Error fetching department:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const getListTimeSlots = async (req: Request, res: Response) => {
  try {
    const timeSlots = await getAllTimeSlots(); // Lấy danh sách thời gian từ service
    res.status(200).json({data: timeSlots}); // Gửi response về client
  }
    catch (error) {
        console.error("Error fetching time slots:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const getAllDoctors = async (req: Request, res: Response) => {
  try {
    const doctors = await getListDoctor(); // Lấy danh sách bác sĩ từ service
    res.status(200).json({data: doctors}); // Gửi response về client
  } catch (error) {
    console.error("Error viewing doctors:", error);
    res.status(500).send("Internal Server Error");
  }
} 


export {
    getDoctorByDeptID,
    getDepartment,
    getDeptByID,
    getListTimeSlots,
    getAllDoctors
};


