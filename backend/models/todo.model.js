const mongoose = require("mongoose");
// const user = require("../models/user.model.js");

const todoSchema = new mongoose.Schema(
  {
    type: String,
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    text: String,
    date: String,
    time: String,
    todoDueTime: String,
  },
  { timestamps: true },
);

const todo = mongoose.model("todo", todoSchema);

module.exports = todo;
