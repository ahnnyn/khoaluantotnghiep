import { NextFunction, Request, Response } from "express";
import "dotenv/config"; // sử dụng dotenv để quản lý biến môi trường
import path from "path";
import fs from "fs";
import mailer from "utils/mailer";
import { sendAppointmentCancellationEmail, sendAppointmentConfirmationEmail } from "services/email/email.services";

const sendEmail = async (req: Request, res: Response) => {
  try {
    const { email, subject, message } = req.body;
    await mailer.sendMail(email, subject, message);
    res.status(200).send("<h3>Email sent successfully</h3>");
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send email",
    });
  }
};

const sendEmailLichKham = async (req: Request, res: Response) => {
  try {
    const { email, hoTen, ngayKham, gioKham, hinhThucKham , tenBacSi, khoa, diaChi, soThuTu} = req.body;
    await sendAppointmentConfirmationEmail({
      email,
      hoTen,
      ngayKham,
      gioKham,
      hinhThucKham,
      tenBacSi,
      khoa,
      diaChi,
      soThuTu
    });
    res.status(200).send("Xác nhận lịch khám đã được gửi!");
  } catch (err) {
    console.error("Lỗi gửi email:", err);
    res.status(500).send("Không gửi được email.");
  }
};

const sendCancellationEmail = async (req: Request, res: Response) => {
  try {
    await sendAppointmentCancellationEmail(req.body);
    res.status(200).send("Email hủy lịch khám đã được gửi!");
  } catch (err) {
    console.error("Lỗi gửi email hủy lịch:", err);
    res.status(500).send("Không gửi được email hủy lịch.");
  }
};


export { sendEmail, sendEmailLichKham, sendCancellationEmail };
