const crypto = require("crypto");

const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { createToken, verifyToken } = require("../utils/jwtToken");
const Email = require("../utils/email");

// ******************************* create and send Token ************************************
const createSendToken = async (user, statusCode, res) => {
  const token = await createToken(user._id);

  // send cookie
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" && "none",
    secure: process.env.NODE_ENV === "production",
  };

  res.cookie("jwt", token, cookieOptions);

  // Remove password and active from sending in json output
  user.password = undefined;
  user.active = undefined;

  res.status(statusCode).json({
    status: "SUCCESS",
    token,
    data: {
      user,
    },
  });
};

// ******************************* Controllers ************************************
// ******************************* Signup User ************************************
exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, photo, password, passwordConfirm } = req.body;

  const user = await User.create({
    name,
    email,
    photo,
    password,
    passwordConfirm,
  });

  const url = `${process.env.FRONTEND_URL}/me`;
  await new Email(user, url).sendWelcome();

  createSendToken(user, 201, res);
});

// ******************************* Login User ************************************
exports.login = catchAsync(async (req, res, next) => {
  // Check if email/password is there
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide both email and password.", 400));
  }

  // Verify email and password
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password, user.password))) {
    return next(new AppError("Invalid Credentials", 401));
  }

  // Create and send token
  createSendToken(user, 200, res);
});

// ******************************* Logout User ************************************
exports.logout = (req, res, next) => {
  res.clearCookie("jwt");
  res.status(200).json({ status: "SUCCESS" });
};

// ******************************* Forgot Password ************************************
exports.forgotPassword = catchAsync(async (req, res, next) => {
  // Get user with the provided email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("Please provide a valid email Id.", 404));
  }

  // Generate random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // send token to user's mail
  const resetURL = `${process.env.FRONTEND_URL}/passwordReset/${resetToken}`;

  try {
    await new Email(user, resetURL).sendPasswordReset();

    res
      .status(200)
      .json({ status: "SUCCESS", message: "Token sent to your email!" });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        "There was an error sending the email. Try again later!",
        500
      )
    );
  }
});

// ******************************* Reset Password ************************************
exports.resetPassword = catchAsync(async (req, res, next) => {
  // Get user based on token if not expired
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new AppError("Invalid Token or token has expired.", 400));
  }

  // save password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // Create and send token
  createSendToken(user, 200, res);
});

// ******************************* Update My Password ************************************
exports.updateMyPassword = catchAsync(async (req, res, next) => {
  // Get user
  const user = await User.findById(req.user.id).select("+password");

  // Verify old password
  if (!(await user.comparePassword(req.body.currentPassword, user.password))) {
    return next(new AppError("Your current password is wrong.", 401));
  }

  // Update new password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  // Create and send token
  createSendToken(user, 200, res);
});

// ******************************* Check cookie validity ************************************
exports.checkCookieValidity = async (req, res, next) => {
  if (req.cookies.jwt) {
    // verify token
    const decodedToken = await verifyToken(req.cookies.jwt);

    // Check if user still exists
    const user = await User.findById(decodedToken.id);
    if (!user) {
      return res.status(200).json({ status: "FAIL" });
    }

    // Check if user changed password after token was issued
    if (user.changedPasswordAfter(decodedToken.iat)) {
      return res.status(200).json({ status: "FAIL" });
    }

    // Grant access to protected route
    res.status(200).json({ status: "SUCCESS", data: { user } });
  } else {
    res.status(200).json({ status: "FAIL" });
  }
};
