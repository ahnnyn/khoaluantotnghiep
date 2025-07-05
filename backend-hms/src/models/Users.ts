import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    gender: { type: Boolean},
    dateOfBirth: { type: Date, required: true },
    phone: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    address: { type: String },
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    accountType: {type: String},
    avatar: { type: String, default: 'default-avatar.png' }, // Đường dẫn đến ảnh đại diện
    price: { type: Number, default: 0 }, // Giá dịch vụ
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    positionId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Position' }],
    roleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
    departmentId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Department' }]
}, {
    timestamps: true,
    collection: 'users'
});

const User = mongoose.model("User", userSchema);
export default User;
