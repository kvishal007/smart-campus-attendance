const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  studentId: String,
  name: String,
  image: String, // base64 image
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Attendance", attendanceSchema);
