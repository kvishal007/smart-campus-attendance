const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  studentId: String,
  subject: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Attendance", attendanceSchema);
