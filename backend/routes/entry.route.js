// const express = require("express");
// const router = express.Router();
// const noteRouter = require("../routes/note.route.js");
// const journalRouter = require("../routes/journal.route.js");
// const todoRouter = require("../routes/todo.route.js");

// router.get("/", function (req, res) {});

// module.exports = router;
//
//
//
//
//
//
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

    const all = [
      ...notes.map((n) => ({ ...n.toObject(), category: "note" })),
      ...journals.map((j) => ({ ...j.toObject(), category: "journal" })),
      ...todos.map((t) => ({ ...t.toObject(), category: "todo" })),
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(all);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching entries", error: error.message });
  }
});

module.exports = router;
