const express = require("express");
const router = express.Router();

const {
  addRoom,
  getRoom,
  getAvailableRooms,
  getRoomById,
  getRoomByHotelId,
  getRoomByRoomType,
  getRoomByArea,
  getRoomByNrGuests,
  getRoomByAmenity,
  updateRoom,
  deleteRoom,
  deleteAll,
} = require("../controllers/room.controller");

router.post("/:id/new", addRoom);
router.get("/", getRoom);
router.get("/available/:search", getAvailableRooms);
router.get("/:hotel_id/:room_number", getRoomById);
router.get("/all/hotel/:id", getRoomByHotelId);
router.get("/type/:hotel_id/:id/", getRoomByRoomType);
router.get("/guests/:id", getRoomByNrGuests);
router.get("/amenity/:hotel_id/:room_number", getRoomByAmenity);
router.put("/edit/:hotel_id/:room_number", updateRoom);
router.delete("/delete/:hotel_id/:id", deleteRoom);
router.delete("/delete", deleteAll);

module.exports = router;
