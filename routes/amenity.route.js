const express = require("express");
const router = express.Router();

const {
  addAmenity,
  getAmenities,
  getAmenityById,

  getAmenityByName,
  assignAmenityToRoom,
  unassignAmenityToRoom,
  getAllAmenitiesOfRoom,
  updateAmenity,
  deleteAmenity,
  deleteAll,
} = require("../controllers/amenity.controller");

router.post("/new", addAmenity);
router.get("/", getAmenities);
router.get("/room/:hotel_id/:room_number", getAllAmenitiesOfRoom);
router.get("/:id", getAmenityById);
router.get("/name/:name", getAmenityByName);
router.post("/assign/:amenity_id", assignAmenityToRoom);
router.post("/unassign/:amenity_id", unassignAmenityToRoom);
router.put("/edit/:id", updateAmenity);
router.delete("/delete/:id", deleteAmenity);
router.delete("/delete", deleteAll);

module.exports = router;
