const express = require("express");
const router = express.Router();
const authentify = require("../middlewares/authetication.middleware.js");
const note = require("../models/note.model.js");

router.post("/notes", authentify, async function (req, res) {
  try {
    const { heading, text, date, time } = req.body;

    const newNote = {
      ownerId: req.user.id,
      heading,
      text,
      date,
      time,
    };
    await newNote.save();
    res.status(201).json(newNote);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating note", error: error.message });
  }
});

module.exports = router;
