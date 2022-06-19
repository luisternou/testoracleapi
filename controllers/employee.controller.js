const Employee = require("../models/employee.model");
const objectId = require("../utils/objectId");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const Admin_Password_Token = require("../models/admin_password_token.model");

exports.addEmployee = (req, res, next) => {
  const hotel_id = req.params.id;
  if (!req.body.dob || !req.body.name || !req.body.position) {
    return res.status(400).json({
      message: "Please provide all fields",
    });
  }

  const hashedPassword = bcrypt.hashSync(req.body.password, 8);

  const new_id = objectId();
  const employee = new Employee({
    employee_id: new_id,
    dob: req.body.dob,
    name: req.body.name,
    position: req.body.position,
    email: req.body.email,
    password: hashedPassword,
    hotel_id: hotel_id,
  });

  Employee.addEmployee(employee, (err, employee) => {
    if (err) {
      return res.status(500).json({
        message: "Employee creation failed",
      });
    }

    return res.status(201).json({
      message: "Employee created successfully",
      employee: employee,
    });
  });
};

exports.superAdminRegister = (req, res, next) => {
  const hashedPassword = bcrypt.hashSync(req.body.password, 8);

  const new_id = objectId();
  const employee = new Employee({
    employee_id: new_id,
    dob: req.body.dob,
    name: req.body.name,
    position: req.body.position,
    email: req.body.email,
    password: hashedPassword,
    hotel_id: req.body.hotel_id,
  });

  Employee.addEmployee(employee, (err, employee) => {
    if (err) {
      return res.status(500).json({
        message: "Employee creation failed",
      });
    }

    return res.status(201).json({
      message: "Employee created successfully",
      employee: employee,
    });
  });
};

exports.loginAdmin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email) {
    console.error("Email is required");
    return res.status(400).json({
      message: "Email is required",
    });
  }

  if (!password) {
    console.error("Email is required");
    return res.status(400).json({
      message: "Password is required",
    });
  }

  Employee.login(email, password, (err, admin) => {
    if (err) {
      if (err.kind === "password_incorrect") {
        return res.status(401).json({
          message: "Password is incorrect",
        });
      }
      return res.status(500).json({
        message: "Error logging in",
      });
    }

    return res.status(200).json({
      message: "Logged in successfully",
      token: admin,
    });
  });
};

exports.forgotPassword = (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    console.error("Email is required");
    return res.status(400).json({
      message: "Email is required",
    });
  }

  Employee.getByEmail(email, (err, admin) => {
    if (err) {
      return res.status(500).json({
        message: "Error getting admin",
      });
    }

    if (!admin) {
      return res.status(404).json({
        message: "Admin not found",
      });
    }

    return res.status(200).json({
      message: "Admin found",
      admin,
    });
  });
};

exports.forgotPassword = (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    console.error("Email is required");
    return res.status(400).json({
      message: "Email is required",
    });
  }

  Employee.getByEmail(email, (err, admin) => {
    if (err) {
      return res.status(500).json({
        message: "Error getting admin",
      });
    }

    if (!admin) {
      return res.status(404).json({
        message: "Admin not found",
      });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");

    const resetTokenObj = new Admin_Password_Token({
      employee_id: admin.employee_id,
      token: resetToken,
      expires: Date.now() + 3600000 * 24,
    });

    Admin_Password_Token.addToken(
      resetTokenObj,
      (err, admin_password_token) => {
        if (err) {
          return res.status(500).json({
            message: "Error adding admin password token",
          });
        }

        return res.status(200).json({
          message: "Admin password token added successfully",
          admin_password_token,
        });
      }
    );
  });
};

exports.resetPasswordController = async (req, res, next) => {
  const resetPasswordToken = req.params.resetToken;
  const { password } = req.body;

  if (!resetPasswordToken) {
    console.error("Reset password token is required");
    return res.status(400).json({
      message: "Reset password token is required",
    });
  }

  if (!password) {
    console.error("Password is required");
    return res.status(400).json({
      message: "Password is required",
    });
  }

  Admin_Password_Token.getToken(
    resetPasswordToken,
    (err, admin_password_token) => {
      if (err) {
        return res.status(500).json({
          message: "Error getting admin password token",
        });
      }

      if (!admin_password_token) {
        return res.status(404).json({
          message: "Admin password token not found",
        });
      }

      if (admin_password_token.expires < Date.now()) {
        return res.status(400).json({
          message: "Admin password token has expired",
        });
      }

      const hashedPassword = bcrypt.hashSync(password, 8);

      Employee.updatePassword(
        resetPasswordToken,
        hashedPassword,
        (err, admin) => {
          if (err) {
            return res.status(500).json({
              message: "Error updating admin password",
            });
          }

          return res.status(200).json({
            message: "Admin password updated successfully",
            admin,
          });
        }
      );
    }
  );
};

exports.getEmployees = (req, res, next) => {
  Employee.getAll((err, employees) => {
    if (err) {
      return res.status(500).json({
        message: "Fetching employees failed",
      });
    }

    return res.status(200).json({
      message: "Employees fetched successfully",
      employees: employees,
    });
  });
};

exports.getEmployeesById = (req, res, next) => {
  const employee_id = req.params.id;

  Employee.findById(employee_id, (err, employee) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).json({
          message: `Employee with id ${employee_id} `,
        });
      }
    }

    return res.status(200).json({
      message: "Employee fetched successfully",
      employee: employee,
    });
  });
};

exports.getAdminEmployee = (req, res, next) => {
  const employee_id = req.params.id;

  Employee.getAdminEmployee(employee_id, (err, employee) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).json({
          message: `Employee with id ${employee_id} `,
        });
      }
    }

    return res.status(200).json({
      message: "Employee fetched successfully",
      employee: employee,
    });
  });
};

exports.getButlerEmployee = (req, res, next) => {
  const employee_id = req.params.id;

  Employee.getButlerEmployee(employee_id, (err, employee) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).json({
          message: `Employee with id ${employee_id} `,
        });
      }
    }

    return res.status(200).json({
      message: "Employee fetched successfully",
      employee: employee,
    });
  });
};

exports.getHousekeepingEmployee = (req, res, next) => {
  const employee_id = req.params.id;

  Employee.getHousekeeperEmployee(employee_id, (err, employee) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).json({
          message: `Employee with id ${employee_id} `,
        });
      }
    }

    return res.status(200).json({
      message: "Employee fetched successfully",
      employee: employee,
    });
  });
};

exports.updateEmployee = (req, res, next) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }
  console.log(req.body);
  Employee.updateEmployee(
    req.params.id,
    new Employee(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `No Employee found with ${req.params.id}.`,
          });
        } else {
          res.status(500).send({
            message: "Error updating Employee with id " + req.params.id,
          });
        }
      } else res.send(data);
    }
  );
};

exports.updateAdminEmployee = (req, res, next) => {
  console.log(req.body);
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  Employee.updateAdminEmployee(
    req.params.id,
    new Employee(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `No Employee found with ${req.params.id}.`,
          });
        } else {
          res.status(500).send({
            message: "Error updating Employee with id " + req.params.id,
          });
        }
      } else res.send(data);
    }
  );
};
exports.deleteEmployee = (req, res, next) => {
  const employee_id = req.params.id;

  Employee.deleteById(employee_id, (err, employee) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).json({
          message: `Employee with id ${employee_id} not found`,
        });
      }
    }

    return res.status(200).json({
      message: "Employee deleted successfully",
      employee: employee,
    });
  });
};

exports.deleteAll = (req, res, next) => {
  Employee.removeAll((err, employees) => {
    if (err) {
      return res.status(500).json({
        message: "Could not delete employees",
      });
    }

    return res.status(200).json({
      message: "Employees deleted successfully",
      employees: employees,
    });
  });
};

exports.getEmployeeByHotelId = (req, res, next) => {
  const hotelId = req.params.id;

  Employee.findByHotelId(hotelId, (err, employee) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).json({
          message: `Employee with hotel id ${hotelId} not found`,
        });
      }
    }

    return res.status(200).json({
      message: "Employee fetched successfully",
      employee: employee,
    });
  });
};

exports.getEmployeeByPosition = (req, res, next) => {
  const position = req.params.id;

  Employee.findByPosition(position, (err, employee) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).json({
          message: `Employees with position ${position} not found`,
        });
      }
    }

    return res.status(200).json({
      message: "Employees fetched successfully",
      employee: employee,
    });
  });
};

exports.getEmployeeByDOB = (req, res, next) => {
  const year = req.params.year;
  const month = req.params.month;
  const day = req.params.day;

  const dob = year + "-" + month + "-" + day;

  Employee.findByDOB(dob, (err, employee) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).json({
          message: `Employee with date of birth ${dob} not found`,
        });
      }
    }

    return res.status(200).json({
      message: "Employee fetched successfully",
      employee: employee,
    });
  });
};

exports.getButlerByRoomNumber = (req, res, next) => {
  const roomNumber = req.params.roomnumber;
  const hotelId = req.params.hotelid;

  Employee.findButlerByRoomNumber(roomNumber, hotelId, (err, employee) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).json({
          message: `Employee with room number ${roomNumber} not found`,
        });
      }
    }

    return res.status(200).json({
      message: "Employee fetched successfully",
      employee: employee,
    });
  });
};

exports.getHousekeepingByRoomNumber = (req, res, next) => {
  const roomNumber = req.params.roomnumber;
  const hotelId = req.params.hotelid;

  Employee.findHousekeepingByRoomNumber(
    roomNumber,
    hotelId,
    (err, employee) => {
      if (err) {
        if (err.kind === "not_found") {
          return res.status(404).json({
            message: `Employee with room number ${roomNumber} not found`,
          });
        }
      }

      return res.status(200).json({
        message: "Employee fetched successfully",
        employee: employee,
      });
    }
  );
};

exports.getEmployeeByName = (req, res, next) => {
  const name = req.params.name;

  Employee.findByName(name, (err, employee) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).json({
          message: `Employee with name ${name} not found`,
        });
      }
    }

    return res.status(200).json({
      message: "Employee fetched successfully",
      employee: employee,
    });
  });
};

exports.assignButler = (req, res, next) => {
  const butler = req.params.id;

  let room = req.body.rooms;

  // remove everything before the - in rooms
  room = room.split("-")[1];

  Employee.assignButler(butler, room, (err, butler) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).json({
          message: `Butler with id ${butler} not found`,
        });
      }
    }

    return res.status(200).json({
      message: "Butler assigned successfully",
      butler: butler,
    });
  });
};

exports.assignHousekeeping = (req, res, next) => {
  const housekeeping = req.params.id;

  let rooms = req.body.rooms;

  rooms = rooms.map((room) => {
    const room_split = room.split("-");
    return {
      employee_id: housekeeping,
      hotel_id: room_split[0],
      room_number: room_split[1],
    };
  });

  // turn the array into an array of tuples
  // for example: [{hotel_id: 6253ca0c6f749618a8d022af, room_number: 1234}] => [["6253ca0c6f749618a8d022af", "1234"]]

  rooms = rooms.map((room) => {
    return [room.hotel_id, room.room_number, room.employee_id];
  });

  Employee.assignHousekeepingToRoom(rooms, (err, housekeeping) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).json({
          message: `Housekeeping with id ${housekeeping} not found`,
        });
      }
    }

    return res.status(200).json({
      message: "Housekeeping assigned successfully",
      housekeeping: housekeeping,
    });
  });
};

exports.unassignButler = (req, res, next) => {
  const butler = req.params.id;

  let room = req.body.rooms;

  // remove everything before the - in rooms
  room = room.split("-")[1];

  Employee.unassignButler(butler, room, (err, butler) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).json({
          message: `Butler with id ${butler} not found`,
        });
      }
    }

    return res.status(200).json({
      message: "Butler assigned successfully",
      butler: butler,
    });
  });
};

exports.unassignHousekeeping = (req, res, next) => {
  const housekeeping = req.params.id;

  let rooms = req.body.rooms;

  rooms = rooms.map((room) => {
    const room_split = room.split("-");
    return {
      employee_id: housekeeping,
      hotel_id: room_split[0],
      room_number: room_split[1],
    };
  });

  // turn the array into an array of tuples
  // for example: [{hotel_id: 6253ca0c6f749618a8d022af, room_number: 1234}] => [["6253ca0c6f749618a8d022af", "1234"]]

  rooms = rooms.map((room) => {
    return [room.hotel_id, room.room_number, room.employee_id];
  });

  Employee.unassignHousekeepingToRoom(rooms, (err, housekeeping) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).json({
          message: `Housekeeping with id ${housekeeping} not found`,
        });
      }
    }

    return res.status(200).json({
      message: "Housekeeping assigned successfully",
      housekeeping: housekeeping,
    });
  });
};
