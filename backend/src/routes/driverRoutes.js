const express = require("express");
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const { protect } = require("../middleware/authMiddleware");
const { listDrivers, getDriver, createDriver, updateDriver, deleteDriver } = require("../controllers/driverController");

const router = express.Router();
const rules = [
  body("driver_name").trim().notEmpty(),
  body("phone_number").trim().notEmpty(),
  body("motorcycle_plate").trim().notEmpty(),
  body("national_id").trim().notEmpty()
];

router.use(protect);
router.get("/", listDrivers);
router.get("/:id", getDriver);
router.post("/", rules, validate, createDriver);
router.put("/:id", rules, validate, updateDriver);
router.delete("/:id", deleteDriver);

module.exports = router;
