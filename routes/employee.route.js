const express = require("express");
const router = express.Router();

const {
  addEmployee,
  superAdminRegister,
  loginAdmin,
  assignButler,
  assignHousekeeping,
  unassignButler,
  unassignHousekeeping,
  getEmployees,
  getEmployeesById,
  getEmployeeByHotelId,
  getAdminEmployee,
  getButlerEmployee,
  getButlerByRoomNumber,
  getHousekeepingByRoomNumber,
  getHousekeepingEmployee,
  getEmployeeByPosition,
  getEmployeeByName,
  getEmployeeByDOB,
  updateEmployee,
  updateAdminEmployee,
  forgotPassword,
  resetPasswordController,
  deleteEmployee,
  deleteAll,
} = require("../controllers/employee.controller");

router.post("/:id/new", addEmployee);
router.post("/new", superAdminRegister);
router.post("/admin/login", loginAdmin);
router.post("/butler/assign/:id", assignButler);
router.post("/housekeeping/assign/:id", assignHousekeeping);
router.post("/butler/unassign/:id", unassignButler);
router.post("/housekeeping/unassign/:id", unassignHousekeeping);
router.get("/", getEmployees);
router.get("/butler/:hotelid/:roomnumber", getButlerByRoomNumber);
router.get("/housekeeping/:hotelid/:roomnumber", getHousekeepingByRoomNumber);
router.get("/:id", getEmployeesById);
router.get("/admin/:id", getAdminEmployee);
router.get("/butler/:id", getButlerEmployee);
router.get("/housekeeping/:id", getHousekeepingEmployee);
router.get("/hotel/:id", getEmployeeByHotelId);
router.get("/position/:id", getEmployeeByPosition);
router.get("/name/:name", getEmployeeByName);
router.get("/dob/:year/:month/:day", getEmployeeByDOB);
router.put("/edit/:id", updateEmployee);
router.put("/edit/admin/:id", updateAdminEmployee);
router.post("/admin/forgot", forgotPassword);
router.put("/admin/resetpassword/:resetToken", resetPasswordController);
router.delete("/delete/:id", deleteEmployee);
router.delete("/delete", deleteAll);

module.exports = router;
