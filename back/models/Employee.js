const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  department: { type: String },
  position: { type: String },
  salary: { type: Number },
  dateJoined: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Employee', EmployeeSchema); 