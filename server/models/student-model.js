const mongoose = require("mongoose");

const Student = mongoose.Schema({
  name: { type: String },
  group: { type: String },
  mark: { type: Number, default: Math.round(Math.random() * 5 + 1) },
  isDonePr: { type: Boolean },
  photo: { type: String },
});

module.exports = mongoose.model("students", Student);
