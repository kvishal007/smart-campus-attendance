# 🎓 Smart Campus – AI-Based Face Recognition Attendance System

An intelligent real-time morning attendance system that uses AI-powered face recognition to automatically verify and mark student attendance.

---

## 🚀 Project Overview

Traditional attendance systems waste valuable classroom time and are prone to errors.  
This project introduces a **real-time, AI-based attendance system** that:

- Automatically detects student faces
- Verifies identity using face recognition
- Marks attendance only during morning hours
- Prevents duplicate attendance
- Provides live attendance updates

Built as a Smart Campus solution aligned with digital transformation in education.

---

## 🧠 Key Features

✅ Real-time face recognition using `face-api.js`  
✅ Automatic attendance marking (8 AM – 10 AM only)  
✅ MongoDB persistent storage  
✅ Duplicate prevention (One attendance per day)  
✅ Live attendance counter using WebSockets  
✅ Student face registration system  
✅ Browser-based AI (No heavy backend AI required)

---

## 🛠️ Tech Stack

**Frontend:**
- HTML
- JavaScript
- face-api.js
- Socket.io (Client)

**Backend:**
- Node.js
- Express.js
- MongoDB
- Mongoose
- Socket.io (Server)

---

## ⚙️ How It Works

### 1️⃣ Student Registration
- Student registers once
- Face descriptor (128D vector) is stored in MongoDB

### 2️⃣ Morning Attendance
- Live camera detects face
- Descriptor compared with stored students
- If match found → attendance marked automatically
- Only allowed between 8 AM – 10 AM

### 3️⃣ Real-Time Updates
- Attendance count updates instantly on dashboard

---

## 📂 Project Structure

