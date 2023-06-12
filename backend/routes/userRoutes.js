const express = require("express");

const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const uploadMiddleware = require("../middlewares/uploadMiddleware");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/forgot-password", authController.forgotPassword);
router.patch("/reset-password/:token", authController.resetPassword);
router.get("/check-cookie-validity", authController.checkCookieValidity);

// Protect all routes below this
router.use(authMiddleware.protect);

router.patch("/update-my-password", authController.updateMyPassword);
router
  .route("/me")
  .get(userController.getUserId, userController.getMe)
  .patch(
    uploadMiddleware.uploadUserPhoto,
    uploadMiddleware.resizeUserPhoto,
    userController.updateMe
  )
  .delete(userController.deleteMe);

// Restrict all routes below this to admin
router.use(authMiddleware.restrictTo("admin"));

router.route("/").get(userController.getAllUsers);
router
  .route("/:id")
  .get(userController.getUserById)
  .patch(userController.updateUserById)
  .delete(userController.deleteUserById);

module.exports = router;
