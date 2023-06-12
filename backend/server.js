// ******************************* Uncaught Exception ************************************
process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception! Shutting down...");
  console.log(err);
  process.exit(1);
});

require("dotenv").config({ path: "./.env" });
const mongoose = require("mongoose");
const app = require("./app");

// ******************************* DB Connection ************************************
mongoose
  .connect(process.env.MONGO_URI)
  .then((conn) => console.log(`MongoDB connected: ${conn.connection.host}`));

// ******************************* Start Server ************************************
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App listening at port ${port}...`);
});

// ******************************* Unhandled Rejection ************************************
process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection! Shutting down...");
  console.log(err);

  server.close(() => process.exit(1));
});
