const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

// ******************************* Schema ************************************
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email ID"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email ID"],
  },
  photo: {
    type: String,
    default: process.env.USER_DEFAULT_IMAGE,
  },
  role: {
    type: String,
    enum: {
      values: ["user", "admin", "guide", "lead-guide"],
      message: "Role can be - user, admin, guide and lead-guide only",
    },
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minLength: [8, "A password must have minimum of 8 characters"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: "Passwords don't match",
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

// ******************************* Pre Middleware ************************************
// Encrypting password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

// Update passwordChangedAt property on password update
userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  // 1sec delay so that passwordChangedAt timestamp is always before jwtTimeStamp if saving in DB is slow
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// Inactive users are not filtered out
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

// ******************************* Instance Methods ************************************
// Compare password
userSchema.methods.comparePassword = async function (
  givenPassword,
  hashedPassword
) {
  return await bcrypt.compare(givenPassword, hashedPassword);
};

// Check if password was changed after token was issued
userSchema.methods.changedPasswordAfter = function (jwtTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return changedTimeStamp > jwtTimeStamp;
  }
  return false;
};

// Create password reset token
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 min
  return resetToken;
};

// ******************************* Model ************************************
const User = mongoose.model("User", userSchema);
module.exports = User;
