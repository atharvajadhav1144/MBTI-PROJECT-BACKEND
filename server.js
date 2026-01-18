const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// If behind a proxy (heroku/nginx), allow correct IPs via X-Forwarded-For
app.set("trust proxy", true);
// ✅ Allow both local + deployed frontend, and Live Server
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5500",
  "http://localhost:5000",
  "http://127.0.0.1:5500",
  "https://knowthyself-7.vercel.app",
];
app.use(
  cors({
    origin: (origin, callback) => {
      // Diagnostic print for debugging
      console.log("Origin received:", origin);
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
// MongoDB connection
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/mbtiDB";
const startServer = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ MongoDB connected");
    // Routes
    const mbtiRoutes = require("./routes/mbtiRoutes");
    app.use("/mbti", mbtiRoutes);
    // Mount the visitors route
    const visitorsRouter = require("./routes/visitors");
    app.use("/api/visitors", visitorsRouter);
    // Test route
    app.get("/", (req, res) => res.send("Server is up! 🚀"));
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () =>
      console.log(`🚀 Server running on port
${PORT}`)
    );
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};
startServer();
