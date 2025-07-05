import { NextFunction, Request, Response } from "express";
import 'dotenv/config'; // sử dụng dotenv để quản lý biến môi trường
import { createWorkSchedule, findMedicalExaminationByDoctorID, findMedicalExaminationByID, findMedicalExaminationByPatientID, findWorkScheduleByDate, findWorkScheduleByDoctorID, getAllTimeSlots, getListDepartment, getListPosition, updateResultMedicalExamination, updateStatusMedicalExamination } from "services/doctor/doctor.services";


const getMedicalExaminationsByPatient = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const examinations = await findMedicalExaminationByPatientID(id);
     res.status(200).json({data: examinations});
  } catch (error) {
    console.error("Error fetching medical examinations:", error);
     res.status(500).json({ message: "Internal server error" });
  }
};

const getMedicalExaminationsByDoctor = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const examinations = await findMedicalExaminationByDoctorID(id);
    res.status(200).json({data: examinations});
  } catch (error) {
    console.error("Error fetching medical examinations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getMedicalExaminationById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const examination = await findMedicalExaminationByID(id);
    if (!examination) {
      res.status(404).json({ message: "Medical examination not found" });
    }
    res.status(200).json({data: examination});
  } catch (error) {
    console.error("Error fetching medical examination:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateMedicalExaminationStatus = async (req: Request, res: Response) => {
  const { id, status } = req.body;
  try {
    const updatedExam = await updateStatusMedicalExamination(id, status);
    res.status(200).json({data: updatedExam});
  } catch (error) {
    console.error("Error updating medical examination status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateMedicalExaminationResult = async (req: Request, res: Response) => {
  const { id, result } = req.body;
  try {
    const updatedExam = await updateResultMedicalExamination(id, result);
    res.status(200).json({data: updatedExam});
  } catch (error) {
    console.error("Error updating medical examination result:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getWorkScheduleByDoctor = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const schedules = await findWorkScheduleByDoctorID(id);
    res.status(200).json({data: schedules});
  } catch (error) {
    console.error("Error fetching work schedules:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getWorkScheduleByDates = async (req: Request, res: Response) => {
  const { id, date } = req.params;
  try {
    const schedules = await findWorkScheduleByDate(id, new Date(date));
    res.status(200).json({data: schedules});
  } catch (error) {
    console.error("Error fetching work schedules by date:", error);
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

const getPosition = async (req: Request, res: Response) => {
  try {
    const positions = await getListPosition(); // Lấy danh sách vị trí từ service
    res.status(200).json({data: positions}); // Gửi response về client
  }catch (error) {
    console.error("Error viewing user:", error);
    res.status(500).send("Internal Server Error");
    }
}

const getTimeSlots = async (req: Request, res: Response) => {
  try {
    const listTimeSlots = await getAllTimeSlots(); // Lấy danh sách khung giờ từ service
    res.status(200).json({data: listTimeSlots}); // Gửi response về client
  }catch (error) {
    console.error("Error fetching time slots:", error); 
    res.status(500).json({ message: "Internal server error" });
  } 
};


const postCreateWorkSchedule = async (req: Request, res: Response) => {
  try {
    const schedule = await createWorkSchedule(req.body);
    res.status(201).json({ message: "Lịch làm việc đã được tạo/cập nhật", data: schedule });
  } catch (error) {
    console.error("Error creating schedule:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};


export {
  getMedicalExaminationsByPatient,
  getMedicalExaminationsByDoctor,
  getMedicalExaminationById,
  updateMedicalExaminationStatus,
  updateMedicalExaminationResult,
  getWorkScheduleByDoctor,
  getWorkScheduleByDates,
  getDepartment,
  getPosition,
  getTimeSlots,
  postCreateWorkSchedule
};


