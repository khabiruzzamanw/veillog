const express = require("express");
const router = express.Router();
const authentify = require("../middlewares/authetication.middleware.js");
const journal = require("../models/journal.model.js");

router.post("/journals", authentify, async function (req, res) {
  try {
    const { heading, text, date, time, dateNumber, month, day } = req.body;

    const newJournal = {
      ownerId: req.user.id,
      heading,
      text,
      date,
      time,
      dateNumber,
      month,
      day,
    };
    await newJournal.save();
    res.status(201).json(newJournal);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating note", error: error.message });
  }
});

module.exports = router;
