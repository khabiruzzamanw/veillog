const express = require("express");
const router = express.Router();
const authentify = require("../middlewares/authetication.middleware.js");
const todo = require("../models/todo.model.js");

router.post("/todos", authentify, async function (req, res) {
  try {
    const { type, text, date, time, todoDueTime } = req.body;

    const newTodo = new todo({
      type,
      ownerId: req.user.id,
      text,
      date,
      time,
      todoDueTime,
    });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating note", error: error.message });
  }
});

router.delete("/todos/:id", authentify, async function (req, res) {
  await todo.findOneAndDelete({ ownerId: req.user.id, _id: req.params.id });
  res.sendStatus(204);
});
router.patch("/todos/:id", authentify, async function (req, res) {
  await todo.findOneAndUpdate(
    { ownerId: req.user.id, _id: req.params.id },
    {
      $set: req.body,
    },
    { returnDocument: "after" },
  );
  res.sendStatus(202);
});

module.exports = router;
