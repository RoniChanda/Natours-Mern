require("dotenv").config({ path: "./.env" });
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const Tour = require("./models/tourModel");
const User = require("./models/userModel");
const Review = require("./models/reviewModel");

// ******************************* DB Connection ************************************
mongoose
  .connect(process.env.MONGO_URI)
  .then((conn) => console.log(`MongoDB connected: ${conn.connection.host}`));

// ******************************* Read JSON File ************************************
const tours = JSON.parse(
  fs.readFileSync(path.join(__dirname, "./dev-data/tours.json"))
);
const users = JSON.parse(
  fs.readFileSync(path.join(__dirname, "./dev-data/users.json"))
);
const reviews = JSON.parse(
  fs.readFileSync(path.join(__dirname, "./dev-data/reviews.json"))
);

// ******************************* Import Data to DB ************************************
const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log("Data loaded successfully!");
  } catch (err) {
    console.error(err);
  }
  process.exit();
};

// ******************************* Delete data from DB ************************************
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log("Data deleted successfully!");
  } catch (err) {
    console.error(err);
  }
  process.exit();
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
