import { NextFunction, Request, Response } from "express";
import "dotenv/config"; // sử dụng dotenv để quản lý biến môi trường
import { cancelMedicalExamination, findMedicalExaminationByPatientID } from "services/patient/patient.services";
import { getListDoctor } from "services/admin/admin.services";

const postCreateMedicalExamination = async (req: Request, res: Response) => {};

const getMedicalExaminationsByPatient = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const examinations = await findMedicalExaminationByPatientID(id);
    res.status(200).json({ data: examinations });
  } catch (error) {
    console.error("Error fetching medical examinations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const putCancelMedicalExamination = async (req: Request, res: Response) => {
    const {id, status } = req.body;
    try {
        const updatedExam = await cancelMedicalExamination(id, status);
        res.status(200).json({ data: updatedExam });
    } catch (error) {
        console.error("Error updating medical examination status:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

//fetch doctor:
const getAllDoctors = async (req: Request, res: Response) => {
  try {
    const doctors = await getListDoctor(); // Lấy danh sách bác sĩ từ service
    res.status(200).json({data: doctors}); // Gửi response về client
  } catch (error) {
    console.error("Error viewing doctors:", error);
    res.status(500).send("Internal Server Error");
  }
} 


export { postCreateMedicalExamination, 
    getMedicalExaminationsByPatient,
    putCancelMedicalExamination,
    getAllDoctors


 };
