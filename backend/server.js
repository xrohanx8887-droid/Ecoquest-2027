const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const User = require("./models/User");
const ClassModel = require("./models/Class");
const Submission = require("./models/Submission");

const app = express();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:8080",
      "*",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res, path) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    },
  })
);

// Serve static files from images directory
app.use(
  "/images",
  express.static(path.join(__dirname, "images"), {
    setHeaders: (res, path) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    },
  })
);

// Connect to MongoDB
const MONGODB_URI =
  "mongodb+srv://AMOL:amolSIH@cluster0.3eye1sz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000,
  })
  .then(async () => {
    console.log("✅ Connected to MongoDB Atlas successfully!");
    // Seed demo users (idempotent)
    try {
      const demoUsers = [
        {
          name: "Teacher Admin",
          email: "teacher@ecolearn.com",
          password: "teacher123",
          role: "teacher",
        },
        {
          name: "Mentor Teacher",
          email: "mentor@ecolearn.com",
          password: "mentor123",
          role: "teacher",
        },
        {
          name: "Demo Student",
          email: "demo@ecolearn.com",
          password: "demo123",
          role: "student",
        },
        {
          name: "Aarav Gupta",
          email: "aarav@ecolearn.com",
          password: "aarav123",
          role: "student",
        },
        {
          name: "Ishika",
          email: "ishika@ecolearn.com",
          password: "ishika123",
          role: "student",
        },
        {
          name: "Vicky",
          email: "vicky@ecolearn.com",
          password: "vicky123",
          role: "student",
        },
      ];
      for (const u of demoUsers) {
        const exists = await User.findOne({ email: u.email });
        if (!exists) {
          const user = new User(u);
          await user.save();
          console.log(`🧪 Seeded user: ${u.email} (${u.role})`);
        }
      }

      // Seed demo classes for teacher
      const teacher = await User.findOne({ email: "teacher@ecolearn.com" });
      if (teacher) {
        const existingClasses = await ClassModel.find({ teacher: teacher._id });
        if (existingClasses.length === 0) {
          const studentA = await User.findOne({ email: "aarav@ecolearn.com" });
          const studentB = await User.findOne({ email: "ishika@ecolearn.com" });
          const studentC = await User.findOne({ email: "vicky@ecolearn.com" });
          const demoStudent = await User.findOne({ email: "demo@ecolearn.com" });

          const classDocs = await ClassModel.insertMany([
            { name: "Class 8C", teacher: teacher._id, students: [studentA?._id, studentB?._id, demoStudent?._id].filter(Boolean) },
            { name: "Class 9B", teacher: teacher._id, students: [studentC?._id, demoStudent?._id].filter(Boolean) },
            { name: "Class 10A", teacher: teacher._id, students: [studentA?._id, studentC?._id].filter(Boolean) },
          ]);
          console.log(`🧪 Seeded ${classDocs.length} classes for teacher ${teacher.email}`);

          // Seed pending submissions
          const class8C = classDocs.find((c) => c.name === "Class 8C");
          const class10A = classDocs.find((c) => c.name === "Class 10A");
          const submissions = [
            { student: studentA?._id, teacher: teacher._id, class: class8C?._id, action: "Planted 2 trees", points: 50 },
            { student: studentB?._id, teacher: teacher._id, class: class10A?._id, action: "Recycled 5kg paper", points: 30 },
            { student: studentC?._id, teacher: teacher._id, class: class8C?._id, action: "Saved 100L water", points: 25 },
          ].filter(s => s.student && s.class);
          if (submissions.length > 0) {
            const countExisting = await Submission.countDocuments({ teacher: teacher._id });
            if (countExisting === 0) {
              await Submission.insertMany(submissions);
              console.log(`🧪 Seeded ${submissions.length} pending submissions`);
            }
          }
        }
      }
    } catch (seedErr) {
      console.error("Seeding demo users failed:", seedErr);
    }
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
const postRoutes = require("./routes/posts");
const authRoutes = require("./routes/auth");
const teacherRoutes = require("./routes/teacher");
app.use("/api/posts", postRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/teacher", teacherRoutes);

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "EcoQuest Backend is running!" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
