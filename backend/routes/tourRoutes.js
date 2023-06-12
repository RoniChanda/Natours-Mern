const express = require("express");

const tourController = require("../controllers/tourController");
const authMiddleware = require("../middlewares/authMiddleware");
const uploadMiddleware = require("../middlewares/uploadMiddleware");
const reviewRouter = require("./reviewRoutes");

const router = express.Router();

// Param Middleware
// router.param("id", tourController.checkID);

// use reviewRouter for this type of routes (mergeParams)
router.use("/:tourId/reviews", reviewRouter);

router.get(
  "/top-5-cheap",
  tourController.aliasTopTour,
  tourController.getAllTours
);
router.get("/tour-stats", tourController.getTourStats);
router.get(
  "/monthly-plan/:year",
  authMiddleware.protect,
  authMiddleware.restrictTo("admin", "lead-guide", "guide"),
  uploadMiddleware.uploadTourPhotos,
  uploadMiddleware.resizeTourPhotos,
  tourController.getMonthlyPlan
);
router.get(
  "/tours-within/:distance/center/:latlng/unit/:unit",
  tourController.getToursWithin
);
router.get("/distances/:latlng/unit/:unit", tourController.getDistances);

router
  .route("/")
  .get(tourController.getAllTours)
  .post(
    authMiddleware.protect,
    authMiddleware.restrictTo("admin", "lead-guide"),
    tourController.createTour
  );

router
  .route("/:id")
  .get(tourController.getTourById)
  .patch(
    authMiddleware.protect,
    authMiddleware.restrictTo("admin", "lead-guide"),
    tourController.updateTourById
  )
  .delete(
    authMiddleware.protect,
    authMiddleware.restrictTo("admin", "lead-guide"),
    tourController.deleteTourById
  );

module.exports = router;
