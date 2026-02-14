const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: String,
  email: String,
  careerGoal: String,
  interests: [String]
});

module.exports = mongoose.model("Student", studentSchema);
