const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { verifyToken } = require("../utils/jwtToken");
const User = require("../models/userModel");

// ******************************* Protected route ************************************
exports.protect = catchAsync(async (req, res, next) => {
  // Get token and check its existance
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError("Please login to proceed!", 401));
  }

  // Verify token
  const decodedToken = await verifyToken(token);

  // Check if user still exists
  const user = await User.findById(decodedToken.id);
  if (!user) {
    return next(new AppError("User no longer exists", 401));
  }

  // Check if user changed password after token was issued
  if (user.changedPasswordAfter(decodedToken.iat)) {
    return next(
      new AppError("User recently changed password. Please login again!", 401)
    );
  }

  // Grant access to protected route
  req.user = user;
  next();
});

// ******************************* Restricted route ************************************
exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You don't have permission to perform this action", 403)
      );
    }

    next();
  };
