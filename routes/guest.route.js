const express = require("express");
const router = express.Router();

const {
  addGuest,
  getAllGuests,
  loginGuest,
  getGuestById,
  getGuestByName,
  getGuestByDOB,
  updateGuest,
  updateGuestProfile,
  forgotPassword,
  resetPasswordController,
  deleteGuest,
  deleteAll,
} = require("../controllers/guest.controller");

router.post("/new", addGuest);
router.post("/login", loginGuest);
router.get("/", getAllGuests);
router.get("/:id", getGuestById);
router.get("/name/:name", getGuestByName);
router.get("/dob/:year/:month/:day", getGuestByDOB);
router.put("/edit/:id", updateGuest);
router.put("/editprofile/:id", updateGuestProfile);
router.post("/password/forgot", forgotPassword);
router.put("/resetpassword/:resetToken", resetPasswordController);
router.delete("/delete/:id", deleteGuest);
router.delete("/delete", deleteAll);

module.exports = router;
