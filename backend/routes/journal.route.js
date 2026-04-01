const express = require("express");
const router = express.Router();
const authentify = require("../middlewares/authetication.middleware.js");
const journal = require("../models/journal.model.js");

router.post("/journals", authentify, async function (req, res) {
  try {
    const { type, heading, text, date, time, dateNumber, month, day } =
      req.body;

    const newJournal = new journal({
      type,
      ownerId: req.user.id,
      heading,
      text,
      date,
      time,
      dateNumber,
      month,
      day,
    });
    await newJournal.save();
    res.status(201).json(newJournal);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating note", error: error.message });
  }
});

router.delete("/journals/:id", authentify, async function (req, res) {
  await journal.findOneAndDelete({ ownerId: req.user.id, _id: req.params.id });
  res.sendStatus(204);
});
router.patch("/journals/:id", authentify, async function (req, res) {
  await journal.findOneAndUpdate(
    { ownerId: req.user.id, _id: req.params.id },
    {
      $set: req.body,
    },
    { returnDocument: "after" },
  );
  res.sendStatus(202);
});

module.exports = router;
