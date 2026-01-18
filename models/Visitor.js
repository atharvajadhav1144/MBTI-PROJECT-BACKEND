const mongoose = require("mongoose");
const { Schema } = mongoose;
const visitorSchema = new Schema({
  name: { type: String, trim: true },
  email: { type: String, trim: true },
  age: { type: Number },
  visitorId: { type: String, index: true },
  ip: { type: String },
  userAgent: { type: String },
  url: { type: String },
  referrer: { type: String },
  device: { type: String },
  browser: { type: String },
  os: { type: String },
  meta: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Visitor", visitorSchema);
