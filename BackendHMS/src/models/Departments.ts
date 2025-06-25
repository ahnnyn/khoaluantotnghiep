import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true // ví dụ: 'Trưởng khoa', 'Bác sĩ điều trị'
    },
    image: {
        type: String,
        },
    description: {
        type: String
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    }
    }, {
    timestamps: true,
    collection: 'departments'
    });

const Department = mongoose.model('Department', departmentSchema);
export default Department;
