const mongoose = require("mongoose");

async function connectToDB() {
  const isDBConnected = await mongoose.connect(process.env.mongodbURL);
  console.log("DB is Connected");
}

module.exports = connectToDB;
