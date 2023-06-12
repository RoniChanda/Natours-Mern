const express = require("express");

const bookingController = require("../controllers/bookingController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(authMiddleware.protect);

router.post(
  "/checkout-session/:tourId",
  bookingController.createCheckoutSession
);

router.use(authMiddleware.restrictTo("admin", "lead-guide"));

router
  .route("/")
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking); // Booking to create by (admin,lead-guide) for cash payments

router
  .route("/:id")
  .get(bookingController.getBookingById)
  .patch(bookingController.updateBookingById)
  .delete(bookingController.deleteBookingById);

module.exports = router;
