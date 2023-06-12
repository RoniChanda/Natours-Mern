const mongoose = require("mongoose");

const Tour = require("./tourModel");

// ******************************* Schema ************************************
const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Review can't be empty"],
    },
    rating: {
      type: Number,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    tour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tour",
      required: [true, "Review must belong to a tour"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Review must belong to an user"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ******************************* Indexes ************************************
// for a user 1 review per tour
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

// ******************************* Pre Middlewares ************************************
// populate user field
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name photo",
  });
  next();
});

// ******************************* Post Middlewares ************************************
// calling the calcAverageRatings fn in Model - for create and update
reviewSchema.post("save", function (doc, next) {
  this.constructor.calcAverageRatings(this.tour);
  next();
});

// calling the calcAverageRatings fn in Model - for delete
reviewSchema.post("findOneAndDelete", (doc, next) => {
  doc.constructor.calcAverageRatings(doc.tour);
  next();
});

// ******************************* Static Methods ************************************
// calculate average ratings of a particular tour
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: "$tour",
        numRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].numRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

// ******************************* Model ************************************
const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
