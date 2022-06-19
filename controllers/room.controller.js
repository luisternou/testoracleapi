const Room = require("../models/room.model");
const objectId = require("../utils/objectId");

exports.addRoom = (req, res, next) => {
  if (
    !req.body.room_number ||
    !req.body.number_guests ||
    !req.body.area ||
    !req.body.type ||
    !req.body.price ||
    !req.body.hotel_id
  ) {
    return res.status(400).json({
      message: "Please provide all fields",
    });
  }

  const new_id = objectId();
  const room = new Room({
    room_id: new_id,
    room_number: req.body.room_number,
    number_guests: req.body.number_guests,
    area: req.body.area,
    type: req.body.type,
    price: req.body.price,
    hotel_id: req.params.id,
    conected_room_hotel_id: req.body.hotel_id,
  });

  Room.addRoom(room, (err, room) => {
    if (err) {
      return res.status(500).json({
        message: "Room creation failed",
      });
    }

    return res.status(201).json({
      message: "Room created successfully",
      room: room,
    });
  });
};

exports.getRoom = (req, res, next) => {
  Room.getAll((err, rooms) => {
    if (err) {
      return res.status(500).json({
        message: "Fetching rooms failed",
      });
    }

    return res.status(200).json({
      message: "Rooms fetched successfully",
      rooms: rooms,
    });
  });
};

exports.getRoomById = (req, res, next) => {
  const hotel_id = req.params.hotel_id;
  const room_number = req.params.room_number;

  Room.findById(hotel_id, room_number, (err, room) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).json({
          message: `Room with hotel ${hotel_id} and room number ${room_number}  not found`,
        });
      }
    }

    return res.status(200).json({
      message: "Room fetched successfully",
      room: room,
    });
  });
};

exports.getRoomByAmenity = (req, res, next) => {
  const hotel_id = req.params.hotel_id;
  const room_number = req.params.room_number;

  Room.getAmenities(hotel_id, room_number, (err, room) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).json({
          message: `Room with hotel ${hotel_id} and room number ${room_number}  not found`,
        });
      }
    }

    return res.status(200).json({
      message: "Room fetched successfully",
      room: room,
    });
  });
};

exports.getAvailableRooms = (req, res, next) => {
  let search = req.params.search;
  // decode search from base64 and turn it into an object
  search = JSON.parse(Buffer.from(search, "base64").toString("ascii"));
  console.log("search", search);

  Room.getAvailableRooms(
    search.hotel_id,
    search.checkin,
    search.checkout,
    (err, rooms) => {
      if (err) {
        return res.status(500).json({
          message: "Fetching rooms failed",
          data: err,
        });
      }

      return res.status(200).json({
        message: "Rooms fetched successfully",
        rooms: rooms,
      });
    }
  );
};

exports.updateRoom = (req, res, next) => {
  const hotel_id = req.params.hotel_id;
  const room_number = req.params.room_number;
  console.log("body");
  console.log(req.body);
  Room.updateRoom(room_number, hotel_id, req.body, (err, room) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).json({
          message: `Room with hotel ${hotel_id} and room number ${room_number}  not found`,
        });
      }
    }

    return res.status(200).json({
      message: "Room updated successfully",
      room: room,
    });
  });
};

exports.deleteRoom = (req, res, next) => {
  const hotel_id = req.params.hotel_id;
  const roomId = req.params.id;

  console.log(hotel_id, roomId);

  Room.deleteById(roomId, hotel_id, (err, room) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).json({
          message: `Room with id ${roomId} not found`,
        });
      }
    }

    return res.status(200).json({
      message: "Room deleted successfully",
      room: room,
    });
  });
};

exports.deleteAll = (req, res, next) => {
  Room.removeAll((err, rooms) => {
    if (err) {
      return res.status(500).json({
        message: "Could not delete rooms",
      });
    }

    return res.status(200).json({
      message: "Rooms deleted successfully",
      rooms: rooms,
    });
  });
};

exports.getRoomByHotelId = (req, res, next) => {
  const hotelId = req.params.id;

  Room.findByHotelId(hotelId, (err, room) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).json({
          message: `Room not found`,
        });
      }
    }

    return res.status(200).json({
      message: "Room fetched successfully",
      rooms: room,
    });
  });
};



exports.getRoomByRoomType = (req, res, next) => {
  const roomType = req.params.id;
  const hotelId = req.params.hotel_id;

  Room.findByRoomType(roomType, hotelId, (err, room) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).json({
          message: `No room with type ${roomType} found`,
        });
      }
    }

    return res.status(200).json({
      message: "Room fetched successfully",
      room: room,
    });
  });
};



exports.getRoomByNrGuests = (req, res, next) => {
  const nrGuests = req.params.id;

  Room.findByNumberGuests(nrGuests, (err, room) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).json({
          message: `Room with id ${nrGuests} not found`,
        });
      }
    }

    return res.status(200).json({
      message: "Room fetched successfully",
      room: room,
    });
  });
};

// exports.getRoomByAmenities = (req, res, next) => {
//     const amenities = req.params.id;

//     Room.findByAmenities(amenities, (err, room) => {
//     if (err) {
//         if (err.kind === "not_found") {
//         return res.status(404).json({
//             message: `Room with id ${roomId} not found`,
//         });
//         }
//     }

//     return res.status(200).json({
//         message: "Room fetched successfully",
//         room: room,
//         });
//     });
// }
