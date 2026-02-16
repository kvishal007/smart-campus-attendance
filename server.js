const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const Student = require("./models/Student");
const Attendance = require("./models/Attendance");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.static("public"));

/* ================= DATABASE ================= */

mongoose.connect("mongodb://127.0.0.1:27017/smartcampus")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

/* ================= REGISTER STUDENT ================= */

app.post("/student/register", async (req, res) => {
  try {
    const { studentId, name, descriptor } = req.body;

    if (!studentId || !name || !descriptor) {
      return res.status(400).json({ message: "Missing data" });
    }

    let student = await Student.findOne({ studentId });

    if (!student) {
      student = new Student({
        studentId,
        name,
        descriptors: [descriptor]
      });
    } else {
      student.descriptors.push(descriptor);
    }

    await student.save();

    res.json({ message: "Sample saved successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= FACE MATCH FUNCTION ================= */

function faceDistance(a, b) {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    sum += Math.pow(a[i] - b[i], 2);
  }
  return Math.sqrt(sum);
}

/* ================= MARK ATTENDANCE ================= */

app.post("/attendance/face-mark", async (req, res) => {
  try {
    const { descriptor, image } = req.body;

    if (!descriptor) {
      return res.status(400).json({ message: "No face descriptor" });
    }

    const students = await Student.find();

    let matchedStudent = null;
    let minDistance = 1;

    for (let student of students) {

      for (let storedDescriptor of student.descriptors) {

        const dist = faceDistance(storedDescriptor, descriptor);

        if (dist < 0.6 && dist < minDistance) {
          minDistance = dist;
          matchedStudent = student;
        }
      }
    }

    if (!matchedStudent) {
      return res.json({ message: "Face not recognized" });
    }

    // Only one attendance per day
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const alreadyMarked = await Attendance.findOne({
      studentId: matchedStudent.studentId,
      date: { $gte: today }
    });

    if (alreadyMarked) {
      return res.json({ message: "Already marked today" });
    }

    await Attendance.create({
      studentId: matchedStudent.studentId,
      name: matchedStudent.name,
      image
    });

    res.json({
      message: "Attendance Marked",
      name: matchedStudent.name
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= GET TODAY ATTENDANCE ================= */

app.get("/attendance/today", async (req, res) => {

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const records = await Attendance.find({
    date: { $gte: today }
  });

  res.json(records);
});

/* ================= START SERVER ================= */

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
