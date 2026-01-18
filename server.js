const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// If behind a proxy (Render / nginx), allow correct IPs via X-Forwarded-For
app.set("trust proxy", true);

// ✅ Allow both local + deployed frontend
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5500",
  "http://localhost:5173",
  "http://127.0.0.1:5500",
  "http://127.0.0.1:5173",

  // ✅ YOUR ACTUAL VERCEL FRONTEND DOMAIN
  "https://knowthyself-frontend.vercel.app",
];

// ✅ CORS Setup
app.use(
  cors({
    origin: (origin, callback) => {
      console.log("Origin received:", origin);

      // allow requests with no origin (Postman / server calls)
      if (!origin) return callback(null, true);

      // ✅ allow localhost
      if (
        origin.startsWith("http://localhost") ||
        origin.startsWith("http://127.0.0.1")
      ) {
        return callback(null, true);
      }

      // ✅ allow ANY vercel domain (prod + preview)
      if (origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
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

    // Visitors route
    const visitorsRouter = require("./routes/visitors");
    app.use("/api/visitors", visitorsRouter);

    // Test route
    app.get("/", (req, res) => res.send("Server is up! 🚀"));

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

startServer();



