import path from "path";
import fs from "fs";
import mailer from "utils/mailer";
import { sendAppointmentConfirmationEmail } from "services/email/email.services";

const sendEmail = async (req, res) => {
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

const sendEmailLichKham = async (req, res) => {
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

export { sendEmail, sendEmailLichKham };
