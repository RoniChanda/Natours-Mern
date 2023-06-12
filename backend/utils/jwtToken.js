const { promisify } = require("util");
const jwt = require("jsonwebtoken");

exports.createToken = (id) =>
  promisify(jwt.sign)({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.verifyToken = (token) =>
  promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY);
