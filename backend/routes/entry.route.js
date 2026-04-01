const express = require("express");
const router = express.Router();
const authentify = require("../middlewares/authetication.middleware.js");
const note = require("../models/note.model.js");
const journal = require("../models/journal.model.js");
const todo = require("../models/todo.model.js");

router.get("/entries", authentify, async (req, res) => {
  try {
    const ownerId = req.user.id;

    const [notes, journals, todos] = await Promise.all([
      note.find({ ownerId }),
      journal.find({ ownerId }),
      todo.find({ ownerId }),
    ]);

    // findNotes(ownerId),
    // findJournals(ownerId),
    // findTodos(ownerId),

    const logs = [...notes, ...journals, ...todos];

    res.json(logs);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching entries", error: error.message });
  }
});

module.exports = router;
