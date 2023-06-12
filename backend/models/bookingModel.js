const mongoose = require("mongoose");

// ******************************* Schema ************************************
const bookingSchema = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tour",
    required: [true, "Booking must belong to a tour"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Booking must belong to a user"],
  },
  price: {
    type: Number,
    required: [true, "Booking must have a price"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  paid: {
    type: Boolean,
    default: true,
  },
});

// ******************************* Pre Middlewares ************************************
// populate user field
bookingSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
  }).populate({ path: "tour", select: "name" });
  next();
});

// ******************************* Model ************************************
const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
