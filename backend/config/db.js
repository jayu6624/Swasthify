const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
function connectToDb() {
  console.log(process.env.MONGODBURI);
  mongoose
    .connect(process.env.MONGODBURI)
    .then(() => {
      console.log("connected to db");
    })
    .catch((err) => console.log(err));
}

module.exports = connectToDb;
