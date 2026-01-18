const express = require("express");
const router = express.Router();
const Visitor = require("../models/Visitor");
const { randomUUID } = require("crypto");
router.post("/", async (req, res) => {
  try {
    const { name, email, age, meta, url, referrer, device, browser, os } =
      req.body;
    const visitor = new Visitor({
      name,
      email,
      age,
      visitorId: randomUUID(),
      ip: req.ip,
      userAgent: req.get("User-Agent"),
      url: url || "",
      referrer: referrer || "",
      device: device || "",
      browser: browser || "",
      os: os || "",
      meta: meta || {},
    });
    await visitor.save();
    res.status(201).json({
      success: true,
      message: "Visitor created successfully",
      visitorId: visitor.visitorId,
    });
  } catch (error) {
    console.error("visitor POST error:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Internal servererror",
        error: error.message,
      });
  }
});
module.exports = router;
