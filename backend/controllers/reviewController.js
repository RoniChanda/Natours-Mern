const Review = require("../models/reviewModel");
// const catchAsync = require("../utils/catchAsync");
const factory = require("./handleFactory");

// ******************************* Middlewares ************************************
exports.setTourUserids = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};

// ******************************* Controllers ************************************
// ******************************* Using Factory Handler ************************************
exports.getAllReviews = factory.getAll(Review);
exports.createReview = factory.create(Review);
exports.getReviewById = factory.getById(Review);
exports.updateReviewById = factory.updateById(Review);
exports.deleteReviewById = factory.deleteById(Review);
