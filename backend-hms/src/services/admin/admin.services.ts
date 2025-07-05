import getConnection from "config/connect.mongo";
import "dotenv/config";
import Department from "models/Departments";
import Position from "models/Position";
import Role from "models/Roles";
import User from "models/Users";


// Mã hóa mật khẩu
const getListDepartment = async () => {
    return await Department.find().lean();
};

const getListPosition = async () => {
    return await Position.find().lean();
}

//fetch doctor
const getListDoctor = async () => {
  const doctorRole = await Role.findOne({ roleName: "DOCTOR" });

  if (!doctorRole) {
    throw new Error('Role "doctor" not found');
  }

  const doctors = await User.find({
    roleId: doctorRole._id,
    status: "active",
  })
    .select("-password")
    .populate("roleId")
    .populate("positionId")
    .populate("departmentId");

  return doctors;
};


export {
    getListDepartment,
    getListPosition,
    getListDoctor
};
