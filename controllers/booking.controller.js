const Booking = require("../models/booking.model");
const objectId = require("../utils/objectid");
exports.addBooking = (req, res, next) => {
  console.log(req.body);
  if (
    !req.body.amount ||
    !req.body.check_in ||
    !req.body.check_out ||
    !req.body.guests ||
    !req.body.guest_id ||
    !req.body.hotel_id
  ) {
    return res.status(400).json({
      message: "Please provide all fields",
    });
  }

  const new_id = objectId();
  const booking = new Booking({
    booking_id: new_id,
    amount: req.body.amount,
    check_in: req.body.check_in,
    check_out: req.body.check_out,
    guests: req.body.guests,
    rooms: req.body.rooms,
    open_amount: req.body.amount,
    guest_id: req.body.guest_id,
    hotel_id: req.body.hotel_id,
    room_number: req.body.room_number,
  });

  Booking.addBooking(booking, (err, booking) => {
    if (err) {
      return res.status(500).json({
        message: "Booking creation failed",
        data: err,
      });
    }

    return res.status(201).json({
      message: "Booking created successfully",
      booking: booking,
    });
  });
};

exports.getBooking = (req, res, next) => {
  Booking.getAll((err, bookings) => {
    if (err) {
      return res.status(500).json({
        message: "Fetching bookings failed",
      });
    }

    return res.status(200).json({
      message: "Bookings fetched successfully",
      bookings: bookings,
    });
  });
};

exports.getBookingById = (req, res, next) => {
  const bookingId = req.params.id;

  Booking.findById(bookingId, (err, booking) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).json({
          message: `Booking with id ${bookingId} not found`,
        });
      } else {
        return res.status(500).json({
          message: "Error retrieving booking with id " + bookingId,
        });
      }
    }

    return res.status(200).json({
      message: "Booking fetched successfully",
      booking: booking,
    });
  });
};

exports.getBookingByGuestId = (req, res, next) => {
  const guestId = req.params.id;

  Booking.getBookingByGuestId(guestId, (err, booking) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).json({
          message: `Booking with guest id ${guestId} not found`,
        });
      } else {
        return res.status(500).json({
          message: "Error retrieving booking with guest id " + guestId,
        });
      }
    }

    return res.status(200).json({
      message: "Booking fetched successfully",
      booking: booking,
    });
  });
};

exports.getBookingByCheckinDate = (req, res, next) => {
  const year = req.params.year;
  const month = req.params.month;
  const day = req.params.day;

  const checkin = year + "-" + month + "-" + day;

  Booking.getBookingByCheckinDate(checkin, (err, booking) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).json({
          message: `Booking with check in ${year}-${month}-${day} not found`,
        });
      } else {
        return res.status(500).json({
          message:
            "Error retrieving booking with check in " +
            year +
            "-" +
            month +
            "-" +
            day,
        });
      }
    }

    return res.status(200).json({
      message: "Booking fetched successfully",
      booking: booking,
    });
  });
};

exports.getBookingByCheckoutDate = (req, res, next) => {
  const year = req.params.year;
  const month = req.params.month;
  const day = req.params.day;

  const checkout = year + "-" + month + "-" + day;

  Booking.getByCheckOutDate(checkout, (err, booking) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).json({
          message: `Booking with check out ${year}-${month}-${day} not found`,
        });
      } else {
        return res.status(500).json({
          message:
            "Error retrieving booking with check out " +
            year +
            "-" +
            month +
            "-" +
            day,
        });
      }
    }

    return res.status(200).json({
      message: "Booking fetched successfully",
      booking: booking,
    });
  });
};

exports.getByOpenAmount = (req, res, next) => {
  Booking.findByOpenAmount((err, booking) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).json({
          message: `Booking with open amount not found`,
        });
      } else {
        return res.status(500).json({
          message: "Error retrieving booking with open amount",
        });
      }
    }

    return res.status(200).json({
      message: "Booking fetched successfully",
      booking: booking,
    });
  });
};

exports.getBookingByHotelId = (req, res, next) => {
  const hotelId = req.params.id;

  Booking.getBookingByHotelId(hotelId, (err, booking) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).json({
          message: `Booking with hotel id ${hotelId} not found`,
        });
      } else {
        return res.status(500).json({
          message: "Error retrieving booking with hotel id " + hotelId,
        });
      }
    }

    return res.status(200).json({
      message: "Booking fetched successfully",
      booking: booking,
    });
  });
};

exports.getBookingByRoom = (req, res, next) => {
  const roomNumber = req.params.roomnumber;
  const hotelId = req.params.hotelid;

  Booking.getBookingByRoom(roomNumber, hotelId, (err, booking) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).json({
          message: `Booking with room number ${roomNumber} not found`,
        });
      } else {
        return res.status(500).json({
          message: "Error retrieving booking with room number " + roomNumber,
        });
      }
    }

    return res.status(200).json({
      message: "Booking fetched successfully",
      booking: booking,
    });
  });
};

exports.updateBooking = (req, res, next) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }
  console.log(req.body);
  Booking.updateById(req.params.id, new Booking(req.body), (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `No booking found with ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error updating Booking with id " + req.params.id,
        });
      }
    } else res.send(data);
  });
};

exports.deleteBooking = (req, res, next) => {
  const bookingId = req.params.id;

  Booking.remove(bookingId, (err, booking) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).json({
          message: `Booking with id ${bookingId} not found`,
        });
      } else {
        return res.status(500).json({
          message: "Could not delete booking with id " + bookingId,
        });
      }
    }

    return res.status(200).json({
      message: "Booking deleted successfully",
    });
  });
};

exports.deleteAll = (req, res, next) => {
  Booking.removeAll((err, bookings) => {
    if (err) {
      return res.status(500).json({
        message: "Could not delete bookings",
      });
    }

    return res.status(200).json({
      message: "Bookings deleted successfully",
    });
  });
};
