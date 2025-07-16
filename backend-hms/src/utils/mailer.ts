import nodemailer from "nodemailer";
import dotenv from "dotenv";
const adminEmail = process.env.ADMIN_EMAIL;
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_PASSWORD,
  },
});

const sendMail = async (to, subject, htmlContent) => {
  const mailOptions = {
    from: '"Healio" <no-reply@healio.vn>',
    to,
    subject,
    text: "Vui lòng sử dụng email hỗ trợ HTML để xem nội dung.",
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error.message);
  }
};

export default {
  sendMail,
};
