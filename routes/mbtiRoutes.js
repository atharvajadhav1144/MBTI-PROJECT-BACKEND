const express = require("express");
const router = express.Router();
const MBTI = require("../models/mbtiModel");
router.get("/:type", async (req, res) => {
  try {
    const type = req.params.type.toUpperCase();
    const mbtiData = await MBTI.findOne({ type }).lean();
    if (!mbtiData) {
      return res.status(404).json({ message: `No data for ${type}` });
    }
    const { songs, books, careers, movies } = mbtiData;
    res.json({ type, songs, books, careers, movies });
  } catch (err) {
    console.error("❌ Error fetching MBTI:", err);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;
