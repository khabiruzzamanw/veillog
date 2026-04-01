const express = require("express");
const router = express.Router();
const authentify = require("../middlewares/authetication.middleware.js");
const note = require("../models/note.model.js");

router.post("/notes", authentify, async function (req, res) {
  try {
    const { type, heading, text, date, time } = req.body;

    const newNote = new note({
      type,
      ownerId: req.user.id,
      heading,
      text,
      date,
      time,
    });
    await newNote.save();
    res.status(201).json(newNote);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating note", error: error.message });
  }
});

router.delete("/notes/:id", authentify, async function (req, res) {
  await note.findOneAndDelete({ ownerId: req.user.id, _id: req.params.id });
  res.sendStatus(204);
});
router.patch("/notes/:id", authentify, async function (req, res) {
  await note.findOneAndUpdate(
    { ownerId: req.user.id, _id: req.params.id },
    {
      $set: req.body,
    },
    { returnDocument: "after" },
  );
  res.sendStatus(202);
});

module.exports = router;
