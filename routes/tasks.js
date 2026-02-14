const express = require("express");
const router = express.Router();

router.post("/suggest", (req, res) => {
  const { careerGoal } = req.body;

  let tasks = [];

  if (careerGoal === "Software Engineer") {
    tasks = [
      "Practice 5 DSA problems",
      "Build small React component",
      "Solve 20 Aptitude questions"
    ];
  } else if (careerGoal === "UPSC") {
    tasks = [
      "Read Current Affairs",
      "Revise Polity notes",
      "Write one essay practice"
    ];
  } else {
    tasks = ["Complete pending assignments"];
  }

  res.json({ tasks });
});

module.exports = router;
