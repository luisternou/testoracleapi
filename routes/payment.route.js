const express = require("express");
const router = express.Router();

const {
  addPayment,
  getPayment,
  getPaymentById,
  getPaymentByBookingId,
  getPaymentByGuestId,
  updatePayment,
  deletePayment,
  deleteAll,
} = require("../controllers/payment.controller");

router.post("/new", addPayment);
router.get("/", getPayment);
router.get("/:id", getPaymentById);
router.get("/booking/:id", getPaymentByBookingId);
router.get("/guest/:id", getPaymentByGuestId);
router.put("/edit/:id", updatePayment);
router.delete("/delete/:id", deletePayment);
router.delete("/delete", deleteAll);

module.exports = router;
