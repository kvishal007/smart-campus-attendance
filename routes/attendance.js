app.post("/attendance/face-mark", upload.single("image"), async (req, res) => {

  const descriptor = JSON.parse(req.body.descriptor);
  const students = await Student.find();

  let matchedStudent = null;
  let minDistance = 1;

  students.forEach(student => {
    const dist = faceDistance(student.descriptor, descriptor);
    if (dist < 0.5 && dist < minDistance) {
      minDistance = dist;
      matchedStudent = student;
    }
  });

  if (!matchedStudent)
    return res.json({ message: "No match found" });

  const today = new Date();
  today.setHours(0,0,0,0);

  const alreadyMarked = await Attendance.findOne({
    studentId: matchedStudent.studentId,
    date: { $gte: today }
  });

  if (!alreadyMarked) {
    await Attendance.create({
      studentId: matchedStudent.studentId,
      name: matchedStudent.name,
      imagePath: req.file ? req.file.path : null
    });
  }

  const totalToday = await Attendance.countDocuments({
    date: { $gte: today }
  });

  io.emit("attendanceUpdate", { totalPresent: totalToday });

  res.json({ message: "Attendance Saved" });
});
