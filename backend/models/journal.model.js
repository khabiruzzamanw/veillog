const mongoose = require("mongoose");
// const user = require("../models/user.model.js");

const journalSchema = new mongoose.Schema(
  {
    type: String,
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    heading: String,
    text: String,
    date: String,
    time: String,
    dateNumber: Number,
    month: String,
    day: String,
  },
  { timestamps: true },
);

const journal = mongoose.model("journal", journalSchema);

module.exports = journal;
