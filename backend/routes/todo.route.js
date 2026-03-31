const express = require("express");
const router = express.Router();
const authentify = require("../middlewares/authetication.middleware.js");
const todo = require("../models/todo.model.js");

router.post("/todos", authentify, async function (req, res) {
  try {
    const { text, todoDueTime } = req.body;

    const newTodo = {
      ownerId: req.user.id,
      text,
      date,
      time,
      todoDueTime,
    };
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating note", error: error.message });
  }
});

module.exports = router;
