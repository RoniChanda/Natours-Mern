const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const compression = require("compression");

const tourRoutes = require("./routes/tourRoutes");
const userRoutes = require("./routes/userRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const bookingController = require("./controllers/bookingController");
const AppError = require("./utils/appError");
const errorHandler = require("./middlewares/errorMiddleware");

// START EXPRESS APP
const app = express();

// ******************************* Global Middlewares ************************************
// Implement cors
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.options("*", cors());

// Serving static files
app.use(express.static(path.join(__dirname, "public")));

// set security HTTP headers
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// Logger for dev
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Limit requests
const limiter = rateLimit({
  //TODO change max to 100
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: new AppError(
    "Too many requests from this IP, please try again in an hour"
  ),
});
app.use("/api", limiter);

// stripe webhook (not global middleware)
app.post(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  bookingController.webhookCheckout
);

// Body parser
app.use(express.json({ limit: "10kb" }));

// Cookie parser
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent paramater pollution
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsAverage",
      "ratingsQuantity",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);

// compression
app.use(compression());

// ******************************* Routes ************************************
app.use("/api/v1/tours", tourRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/bookings", bookingRoutes);

app.all("*", (req, res, next) => {
  next(
    new AppError(`Can't find ${req.originalUrl} route on this server!`, 404)
  );
});

// ******************************* Error Middleware ************************************
app.use(errorHandler);

module.exports = app;
