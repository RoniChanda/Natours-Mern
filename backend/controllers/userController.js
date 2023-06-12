const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handleFactory");

// ******************************* filter req.body ************************************
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

// ******************************* Middleware ************************************
exports.getUserId = (req, res, next) => {
  req.params.id = req.user._id;
  next();
};

// ******************************* Controllers ************************************
// ******************************* Update Me ************************************
exports.updateMe = catchAsync(async (req, res, next) => {
  // Create an error if user tries to change password in this route
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /update-my-password",
        400
      )
    );
  }

  // Filter unwanted field names
  const filteredBody = filterObj(req.body, "name", "email");
  // Adding photo filename
  if (req.photo) filteredBody.photo = req.photo;

  const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "SUCCESS",
    data: {
      user: updatedUser,
    },
  });
});

// ******************************* Delete Me ************************************
exports.deleteMe = catchAsync(async (req, res, next) => {
  // change active field to false, but don't delete from DB
  await User.findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).json({
    status: "SUCCESS",
    data: null,
  });
});

// ******************************* Using Factory Handler ************************************
exports.getMe = factory.getById(User);
exports.getAllUsers = factory.getAll(User);
exports.getUserById = factory.getById(User);
exports.updateUserById = factory.updateById(User);
exports.deleteUserById = factory.deleteById(User);
