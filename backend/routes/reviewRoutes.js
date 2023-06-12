const express = require("express");

const reviewController = require("../controllers/reviewController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router({ mergeParams: true }); // merges params from tour routes

router.use(authMiddleware.protect);

router
  .route("/")
  .get(reviewController.getAllReviews)
  .post(
    authMiddleware.restrictTo("user"),
    reviewController.setTourUserids,
    reviewController.createReview
  );

router
  .route("/:id")
  .get(reviewController.getReviewById)
  .patch(
    authMiddleware.restrictTo("user", "admin"),
    reviewController.updateReviewById
  )
  .delete(
    authMiddleware.restrictTo("user", "admin"),
    reviewController.deleteReviewById
  );

module.exports = router;
