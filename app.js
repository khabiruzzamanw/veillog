const express = require("express");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const userRouter = require("./backend/routes/user.route.js");
const entryRouter = require("./backend/routes/entry.route.js");
const noteRouter = require("./backend/routes/note.route.js");
const journalRouter = require("./backend/routes/journal.route.js");
const todoRouter = require("./backend/routes/todo.route.js");
const connectToDB = require("./backend/config/db.js");
dotenv.config();
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", userRouter);
app.use("/api", entryRouter);
app.use("/api", noteRouter);
app.use("/api", journalRouter);
app.use("/api", todoRouter);

async function startServer() {
  try {
    connectToDB();
    app.listen(process.env.PORT, () => {
      console.log(`server is running at port : ${process.env.PORT}`);
    });
  } catch (error) {
    console.log("server could start", error);
  }
}

startServer();
