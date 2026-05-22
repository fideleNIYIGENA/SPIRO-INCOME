const express = require("express");
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const { protect } = require("../middleware/authMiddleware");
const { listIncome, createIncome, updateIncome, deleteIncome } = require("../controllers/incomeController");

const router = express.Router();

router.use(protect);
router.get("/", listIncome);
router.post("/", [
  body("amount").isFloat({ min: 0.01 }),
  body("payment_date").optional({ nullable: true }).isISO8601(),
  body("payment_time").optional({ nullable: true }).matches(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/)
], validate, createIncome);
router.put("/:id", [
  body("driver_id").isInt(),
  body("amount").isFloat({ min: 0.01 }),
  body("payment_date").isISO8601(),
  body("payment_time").matches(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/)
], validate, updateIncome);
router.delete("/:id", deleteIncome);

module.exports = router;
