import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  }
}, {
  timestamps: true,
});

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;