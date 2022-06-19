const express = require("express");
const router = express.Router();

const {
  addHotel,
  getHotels,
  getHotelById,
  getHotelCity,
  getHotelSearch,
  getStats,
  updateHotel,
  deleteHotel,
  deleteAll




} = require("../controllers/hotel.controller");


router.post("/new", addHotel);
router.get("/", getHotels);
router.get("/city/", getHotelCity)
router.get("/:id", getHotelById);
router.get("/search/:search", getHotelSearch);
router.get("/stats/:id", getStats); // todo
router.put("/edit/:id", updateHotel);
router.delete("/delete/:id", deleteHotel);
router.delete("/delete", deleteAll);
;

module.exports = router;
