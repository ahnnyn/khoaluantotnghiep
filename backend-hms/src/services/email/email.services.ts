import fs from "fs";
import path from "path";
import mailer from "utils/mailer";

const sendAppointmentConfirmationEmail = async ({
  email,
  hoTen,
  ngayKham,
  gioKham,
  hinhThucKham,
  tenBacSi,
  khoa,
  diaChi,
  soThuTu
}) => {
  const templatePath = path.join(
    __dirname,
    "../../templates/booking-confirmation.html"
  );
  let html = fs.readFileSync(templatePath, "utf-8");

  html = html
    .replace("{{hoTen}}", hoTen)
    .replace("{{ngayKham}}", ngayKham)
    .replace("{{gioKham}}", gioKham)
    .replace("{{hinhThucKham}}", hinhThucKham)
    .replace("{{tenBacSi}}", tenBacSi)
    .replace("{{khoa}}", khoa)
    .replace("{{diaChi}}", diaChi || "N/A")
    .replace("{{soThuTu}}", soThuTu || "N/A");

  await mailer.sendMail(email, "Xác nhận lịch khám thành công", html);
};

export { sendAppointmentConfirmationEmail };
