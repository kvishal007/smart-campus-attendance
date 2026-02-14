const express = require("express");
const QRCode = require("qrcode");
const Attendance = require("../models/Attendance");

const router = express.Router();

// Generate QR Code
router.get("/generate", async (req, res) => {
  const sessionData = {
    subject: "Data Structures",
    time: Date.now()
  };

  const qr = await QRCode.toDataURL(JSON.stringify(sessionData));
  res.json({ qr });
});

// Mark attendance
router.post("/mark", async (req, res) => {
  const { studentId, subject } = req.body;

  const newAttendance = new Attendance({
    studentId,
    subject
  });

  await newAttendance.save();

  res.json({ message: "Attendance Marked" });
});

module.exports = router;
