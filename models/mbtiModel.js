const mongoose = require("mongoose");
const mbtiSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    unique: true,
  },
  songs: [String],
  books: [String],
  careers: [String],
  movies: [String],
});
const MBTI = mongoose.model("MBTI", mbtiSchema);
module.exports = MBTI;
