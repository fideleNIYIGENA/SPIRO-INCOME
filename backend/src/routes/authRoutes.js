const express = require("express");
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const { protect } = require("../middleware/authMiddleware");
const { login, me, changePassword, forgotPassword, resetPassword } = require("../controllers/authController");

const router = express.Router();

router.post("/login", [
  body("email").isEmail().normalizeEmail(),
  body("password").notEmpty()
], validate, login);

router.get("/me", protect, me);

router.post("/change-password", protect, [
  body("currentPassword").notEmpty(),
  body("newPassword").isLength({ min: 8 }).withMessage("New password must be at least 8 characters")
], validate, changePassword);

router.post("/forgot-password", [
  body("email").isEmail().normalizeEmail()
], validate, forgotPassword);

router.post("/reset-password", [
  body("token").notEmpty(),
  body("newPassword").isLength({ min: 8 }).withMessage("New password must be at least 8 characters")
], validate, resetPassword);

module.exports = router;
