import mongoose from 'mongoose';

const RoleSchema = new mongoose.Schema({
  roleName: {type: String, required: true, unique: true},
  status: {type: String, enum: ['active', 'inactive'], default: 'active'},
  description: {type: String, default: ''}
  
});

const Role = mongoose.model('Role', RoleSchema);
export default Role;