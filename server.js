const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

/* ===========================
   DATABASE
=========================== */
mongoose.connect("mongodb://127.0.0.1:27017/smartcampus")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

/* ===========================
   SCHEMAS
=========================== */
const studentSchema = new mongoose.Schema({
  studentId: String,
  name: String,
  descriptor: [Number]
});

const attendanceSchema = new mongoose.Schema({
  studentId: String,
  name: String,
  date: { type: Date, default: Date.now }
});

const Student = mongoose.model("Student", studentSchema);
const Attendance = mongoose.model("Attendance", attendanceSchema);

/* ===========================
   SOCKET
=========================== */
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
});

/* ===========================
   REGISTER STUDENT FACE
=========================== */
app.post("/student/register", async (req, res) => {
  const { studentId, name, descriptor } = req.body;

  if (!studentId || !descriptor)
    return res.status(400).json({ message: "Missing data" });

  const existing = await Student.findOne({ studentId });
  if (existing)
    return res.json({ message: "Student already registered" });

  const student = new Student({ studentId, name, descriptor });
  await student.save();

  res.json({ message: "Student registered successfully" });
});

/* ===========================
   FACE ATTENDANCE MARK
=========================== */
function euclideanDistance(a, b) {
  return Math.sqrt(
    a.map((x, i) => Math.pow(x - b[i], 2))
      .reduce((sum, val) => sum + val, 0)
  );
}

app.post("/attendance/face-mark", async (req, res) => {
  const { descriptor } = req.body;

  const now = new Date();
  const hour = now.getHours();

  if (hour < 8 || hour > 10)
    return res.json({ message: "Attendance allowed only 8AM-10AM" });

  const students = await Student.find();

  let matchedStudent = null;

  for (let student of students) {
    const distance = euclideanDistance(descriptor, student.descriptor);

    if (distance < 0.6) {
      matchedStudent = student;
      break;
    }
  }

  if (!matchedStudent)
    return res.json({ message: "Face not recognized" });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const alreadyMarked = await Attendance.findOne({
    studentId: matchedStudent.studentId,
    date: { $gte: today }
  });

  if (alreadyMarked)
    return res.json({ message: "Already marked today" });

  const attendance = new Attendance({
    studentId: matchedStudent.studentId,
    name: matchedStudent.name
  });

  await attendance.save();

  const totalPresent = await Attendance.countDocuments({
    date: { $gte: today }
  });

  io.emit("attendanceUpdate", { totalPresent });

  res.json({ message: "Attendance marked for " + matchedStudent.name });
});

/* ===========================
   VIEW TODAY ATTENDANCE
=========================== */
app.get("/attendance/today", async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const data = await Attendance.find({
    date: { $gte: today }
  });

  res.json(data);
});

/* ===========================
   SERVER START
=========================== */
server.listen(5000, () => {
  console.log("Server running on port 5000");
});
