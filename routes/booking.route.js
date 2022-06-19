const express = require("express");
const router = express.Router();

const {
  addBooking,
  getBooking,
  getBookingById,
  getBookingByHotelId,
  getBookingByGuestId,
  getBookingByCheckinDate,
  getBookingByCheckoutDate,
  getByOpenAmount,
  getBookingByRoom,
  updateBooking,
  deleteBooking,
  deleteAll,
} = require("../controllers/booking.controller");

router.post("/new", addBooking);
router.get("/", getBooking);
router.get("/:id", getBookingById);
router.get("/guest/:id", getBookingByGuestId);
router.get("/hotel/:id", getBookingByHotelId);
router.get("/checkin/:year/:month/:day", getBookingByCheckinDate);
router.get("/checkout/:year/:month/:day", getBookingByCheckoutDate);
router.get("/open", getByOpenAmount);
router.get("/room/:hotel_id/:roomnumber", getBookingByRoom);
router.put("/edit/:id", updateBooking);
router.delete("/delete/:id", deleteBooking);
router.delete("/delete", deleteAll);

module.exports = router;
