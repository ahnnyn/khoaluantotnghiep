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

const sendMail = async (
  to: string,
  subject: string,
  htmlContent: string,
  options = {}
) => {
  const mailOptions = {
    from: '"Healio" <no-reply@healio.vn>',
    to,
    subject,
    text: "Vui lòng sử dụng email hỗ trợ HTML để xem nội dung.",
    html: htmlContent,
    ...options, // ⬅ Hỗ trợ cc, bcc, attachments, v.v.
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error.message);
    throw error;
  }
};

export default {
  sendMail,
};
