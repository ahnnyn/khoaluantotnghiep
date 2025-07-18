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
  soThuTu,
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

const sendAppointmentCancellationEmail = async ({
  email,
  hoTen,
  ngayKham,
  gioKham,
  hinhThucKham,
  tenBacSi,
  khoa,
  diaChi,
  soThuTu,
  lyDoHuy,
  linkDatLich = "https://healio.vn/dat-lich",
}) => {
  const templatePath = path.join(
    __dirname,
    "../../templates/cancel-booking-notification.html"
  );

  let html = fs.readFileSync(templatePath, "utf-8");

  html = html
    .replace(/{{hoTen}}/g, hoTen)
    .replace(/{{ngayKham}}/g, ngayKham)
    .replace(/{{gioKham}}/g, gioKham)
    .replace(/{{hinhThucKham}}/g, hinhThucKham)
    .replace(/{{tenBacSi}}/g, tenBacSi)
    .replace(/{{khoa}}/g, khoa)
    .replace(/{{diaChi}}/g, diaChi || "N/A")
    .replace(/{{soThuTu}}/g, soThuTu || "N/A")
    .replace(/{{lyDoHuy}}/g, lyDoHuy)
    .replace(/{{linkDatLich}}/g, linkDatLich);

  await mailer.sendMail(email, "Thông báo hủy lịch khám", html, {
    cc: "dieuphoi@healio.vn",
  });
};

export { sendAppointmentConfirmationEmail, sendAppointmentCancellationEmail };
