const Guest = require("../models/guest.model");
const Guest_Password_Token = require("../models/guest_password_token.model");
const objectId = require("../utils/objectId");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

const HOST = process.env.HOST || "localhost";
const CLIENT_PORT = process.env.CLIENT_PORT || "3000";

exports.addGuest = (req, res, next) => {
  if (
    !req.body.name ||
    !req.body.dob ||
    !req.body.email ||
    !req.body.password
  ) {
    return res.status(400).json({
      message: "Please provide all fields",
    });
  }

  // hash password before saving in database
  const hashedPassword = bcrypt.hashSync(req.body.password, 8);

  const guest = new Guest({
    guest_id: objectId(),
    name: req.body.name,
    dob: req.body.dob,
    email: req.body.email,
    password: hashedPassword,
  });

  Guest.addGuest(guest, (err, guest) => {
    if (err) {
      if (err.kind === "user_found") {
        return res.status(400).json({
          message: "Guest already exists",
        });
      }
      return res.status(500).json({
        message: "Error adding guest",
      });
    }

    return res.status(201).json({
      message: "Guest added successfully",
      guest,
    });
  });
};

exports.loginGuest = async (req, res, next) => {
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

  Guest.login(email, password, (err, guest) => {
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
      token: guest,
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

  Guest.getByEmail(email, (err, guest) => {
    if (err) {
      return res.status(500).json({
        message: "Error getting guest",
      });
    }

    if (!guest) {
      return res.status(404).json({
        message: "Guest not found",
      });
    }

    return res.status(200).json({
      message: "Guest found",
      guest,
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

  Guest.getByEmail(email, (err, guest) => {
    if (err) {
      return res.status(500).json({
        message: "Error getting guest",
      });
    }

    if (!guest) {
      return res.status(404).json({
        message: "Guest not found",
      });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");

    const resetTokenObj = new Guest_Password_Token({
      guest_id: guest.guest_id,
      token: resetToken,
      expires: Date.now() + 3600000 * 24,
    });

    Guest_Password_Token.addToken(
      resetTokenObj,
      (err, guest_password_token) => {
        if (err) {
          return res.status(500).json({
            message: "Error adding guest password token",
          });
        }

        return res.status(200).json({
          message: "Guest password token added successfully",
          guest_password_token,
        });
      }
    );

    const resetUrl = `http://${HOST}:${CLIENT_PORT}/password/reset/${resetToken}`;

    const message = `
      <h1>You have requested a password reset</h1>
      <hr>
      <p>Howzit ${guest.name}, </p><br>
      <p>Please click on the link to reset your password:</p>
      <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
      <br>
      <br>
      <br>
      <code>ViLix FMEA</code>
    `;

    try {
      sendEmail({
        to: email,
        subject: "Password Reset",
        text: message,
      });

      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
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

  Guest_Password_Token.getToken(
    resetPasswordToken,
    (err, guest_password_token) => {
      if (err) {
        return res.status(500).json({
          message: "Error getting guest password token",
        });
      }

      if (!guest_password_token) {
        return res.status(404).json({
          message: "Guest password token not found",
        });
      }

      if (guest_password_token.expires < Date.now()) {
        return res.status(400).json({
          message: "Guest password token has expired",
        });
      }

      const hashedPassword = bcrypt.hashSync(password, 8);

      Guest.updatePassword(resetPasswordToken, hashedPassword, (err, guest) => {
        if (err) {
          return res.status(500).json({
            message: "Error updating guest password",
          });
        }

        return res.status(200).json({
          message: "Guest password updated successfully",
          guest,
        });
      });
    }
  );
};
exports.getAllGuests = (req, res, next) => {
  Guest.getAll((err, amenities) => {
    if (err) {
      return res.status(500).json({
        message: "Fetching amenities failed",
      });
    }

    return res.status(200).json({
      message: "Amenities fetched successfully",
      amenities: amenities,
    });
  });
};

exports.getGuestById = (req, res, next) => {
  const guest_id = req.params.id;

  Guest.getById(guest_id, (err, guest) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).json({
          message: `Guest with id ${guest_id} not found`,
        });
      }
    }

    return res.status(200).json({
      message: "Guest fetched successfully",
      guest: guest,
    });
  });
};

exports.getGuestByName = (req, res, next) => {
  const guest_name = req.params.name;

  Guest.getByName(guest_name, (err, guest) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).json({
          message: `Guest with name ${guest_name} not found`,
        });
      }
    }

    return res.status(200).json({
      message: "Guest fetched successfully",
      guest: guest,
    });
  });
};

exports.getGuestByDOB = (req, res, next) => {
  const year = req.params.year;
  const month = req.params.month;
  const day = req.params.day;

  const dob = year + "-" + month + "-" + day;

  Guest.getByDOB(dob, (err, guest) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).json({
          message: `Guest with dob ${dob} not found`,
        });
      }
    }

    return res.status(200).json({
      message: "Guest fetched successfully",
      guest: guest,
    });
  });
};

exports.updateGuest = (req, res, next) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }
  console.log(req.body);
  Guest.updateGuest(req.params.id, new Guest(req.body), (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `No Guest found with ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error updating Guest with id " + req.params.id,
        });
      }
    } else res.send(data);
  });
};

exports.updateGuestProfile = (req, res, next) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  let guest = new Guest(req.body);
  guest.password = bcrypt.hashSync(req.body.password, 8);

  Guest.updateGuestProfile(req.params.id, guest, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `No Guest found with ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error updating Guest with id " + req.params.id,
        });
      }
    } else res.send(data);
  });
};

exports.deleteGuest = (req, res, next) => {
  const guest_id = req.params.id;

  Guest.delete(guest_id, (err, guest) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).json({
          message: `Guest with id ${guest_id} not found`,
        });
      }
    }

    return res.status(200).json({
      message: "Guest deleted successfully",
      guest: guest,
    });
  });
};

exports.deleteAll = (req, res, next) => {
  Guest.deleteAll((err, guest) => {
    if (err) {
      return res.status(500).json({
        message: "Deleting amenities failed",
      });
    }

    return res.status(200).json({
      message: "Amenities deleted successfully",
      guest: guest,
    });
  });
};
