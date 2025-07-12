import getConnection from "config/connect.mongo";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { ACCOUNT_TYPE } from "config/constants";
import Role from "models/Roles";
import User from "models/Users";

const saltRounds = 10;

// Mã hóa mật khẩu
const hashPassword = async (plain: string) => {
  return await bcrypt.hash(plain, saltRounds);
};

// So sánh mật khẩu
const comparePassword = async (plainText: string, hashed: string) => {
  return await bcrypt.compare(plainText, hashed);
};

// Kiểm tra email tồn tại
const isEmailExist = async (email: string) => {
  return await User.findOne({ email });
};

// Tạo user mới
const handleCreateUser = async (
  fullname: string,
  username: string,
  password: string,
  email: string,
  phoneNumber: string,
  avatar: string
) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("Email đã được sử dụng.");
  }

  await User.create({
    fullName: fullname,
    username,
    password: await bcrypt.hash(password, 10),
    email,
    phoneNumber,
    accountType: ACCOUNT_TYPE.SYSTEM,
    avatar: avatar || "",
  });
};



// Xóa user theo ID
const handleDeleteUser = async (id: string) => {
  await User.deleteOne({ _id: id });
};

// Lấy tất cả user
const getAllUsers = async () => {
  return await User.find().lean();
};

// Lấy user theo ID
const getUserByID = async (id: string) => {
const user = await User.findById(id)
  .populate("departmentId", "name image description")
  .populate("positionId", "name image description")
  .populate("roleId", "roleName");

if (!user) {
  throw new Error("Người dùng không tồn tại");
}

return user;
};

// Cập nhật user
const handleUpdateUser = async (
  id: string,
  fullName?: string,
  gender?: boolean,
  dateOfBirth?: Date,
  phone?: string,
  email?: string,
  address?: string,
  avatar?: string | null,
  price?: number | null,
  positionId: string[] = [],
  departmentId: string[] = []
) => {
 const updateData: any = {
  ...(fullName !== undefined && { fullName }),
  ...(gender !== undefined && { gender }),
  ...(dateOfBirth !== undefined && { dateOfBirth }),
  ...(phone !== undefined && { phone }),
  ...(email !== undefined && { email }),
  ...(address !== undefined && { address }),
  ...(avatar !== undefined && { avatar }),
  ...(price !== undefined && { price }),
  ...(Array.isArray(positionId) && { positionId }),
  ...(Array.isArray(departmentId) && { departmentId }),
};

  const result = await User.updateOne({ _id: id }, updateData);

  if (result.modifiedCount === 0) {
    throw new Error('Cập nhật không thành công hoặc không có thay đổi nào.');
  }

  return result;
};

// Cập nhật user
const handleUpdatePassword = async (
  id: string,
  oldPassword: string,
  newPassword?: string,
  newUsername?: string
) => {
  const user = await User.findById(id);
  if (!user) {
    throw new Error("Người dùng không tồn tại.");
  }

  const updateData: any = {};

  // Kiểm tra và cập nhật username nếu có
  if (newUsername && newUsername !== user.username) {
    const existingUsername = await User.findOne({ username: newUsername });
    if (existingUsername) {
      throw new Error("Tên đăng nhập đã tồn tại.");
    }
    updateData.username = newUsername;
  }

  // Kiểm tra và cập nhật mật khẩu nếu có
  if (newPassword) {
    const isMatch = await comparePassword(oldPassword, user.password);
    if (!isMatch) {
      throw new Error("Mật khẩu cũ không chính xác.");
    }
    const hashedPassword = await hashPassword(newPassword);
    updateData.password = hashedPassword;
  }

  // Không có gì thay đổi
  if (Object.keys(updateData).length === 0) {
    throw new Error("Không có thông tin nào được thay đổi.");
  }

  const result = await User.updateOne({ _id: id }, updateData);

  if (result.modifiedCount === 0) {
    throw new Error("Không có thay đổi hoặc cập nhật thất bại.");
  }

  return result;
};


// Đăng nhập
const handleUserLogin = async (username: string, password: string) => {
  await getConnection();
  const userRaw = await User.findOne({ username });
  if (!userRaw) {
    throw new Error(`User with username is ${username} not found.`);
  }

const user = await userRaw.populate("roleId", "roleName");

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid password.");
  }

  const roleName = (user.roleId as any)?.roleName || "unknown";


  const payload = {
    _id: user._id,
    username: user.username,
    fullName:  user.fullName,
    gender: user.gender,
    email:  user.email,
    address:  user.address,
    phone:  user.phone,
    avatar:  user.avatar,
    role:  roleName,
  };

  const secret = process.env.JWT_SECRET;
  const accessToken = jwt.sign(payload, secret as string, {
        expiresIn: '1d' // thời gian hết hạn của token
    });

  return { accessToken, user: payload };
};

const handleUserLogout = async (token: string) => {
  try {
    // Nếu bạn không có blacklist thì không cần verify
    jwt.verify(token, process.env.JWT_SECRET as string); 
    return { success: true, message: "Logout successful" };
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
};

export {
  handleCreateUser,
  getAllUsers,
  handleDeleteUser,
  getUserByID,
  handleUpdateUser,
  handleUserLogin,
  hashPassword,
  comparePassword,
  isEmailExist,
  handleUserLogout,
  handleUpdatePassword
};
