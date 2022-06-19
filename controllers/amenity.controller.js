const Amenity = require("../models/amenity.model");
const objectId = require("../utils/objectId");

exports.addAmenity = (req, res, next) => {
  if (!req.body.amenity_name) {
    return res.status(400).json({
      message: "Please provide all fields",
    });
  }

  const new_id = objectId();
  const amenity = new Amenity({
    amenity_id: new_id,
    amenity_name: req.body.amenity_name,
  });

  Amenity.addAmenity(amenity, (err, amenity) => {
    if (err) {
      return res.status(500).json({
        message: "Amenity creation failed",
      });
    }

    return res.status(201).json({
      message: "Amenity created successfully",
      amenity: amenity,
    });
  });
};

exports.getAmenities = (req, res, next) => {
  Amenity.getAll((err, amenities) => {
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

exports.getAmenityById = (req, res, next) => {
  const amenity_id = req.params.id;

  Amenity.getById(amenity_id, (err, amenity) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).json({
          message: `Amenity with id ${amenity_id} not found`,
        });
      }
    }

    return res.status(200).json({
      message: "Amenity fetched successfully",
      amenity: amenity,
    });
  });
};

exports.getAmenityByName = (req, res, next) => {
  const amenity_name = req.params.name;

  Amenity.getByName(amenity_name, (err, amenity) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).json({
          message: `Amenity with name ${amenity_name} not found`,
        });
      }
    }

    return res.status(200).json({
      message: "Amenity fetched successfully",
      amenity: amenity,
    });
  });
};

exports.getAllAmenitiesOfRoom = (req, res, next) => {
  const hotel_id = req.params.hotel_id;
  const room_number = req.params.room_number;

  Amenity.getAllAmenitiesOfRoom(hotel_id, room_number, (err, amenities) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).json({
          message: `Amenities of room ${room_number} not found`,
        });
      }
    }

    return res.status(200).json({
      message: "Amenities fetched successfully",
      amenities: amenities,
    });
  });
};

exports.assignAmenityToRoom = (req, res, next) => {
  const amenity_id = req.params.amenity_id;

  let rooms = req.body.rooms;

  rooms = rooms.map((room) => {
    const room_split = room.split("-");
    return {
      amenity_id: amenity_id,
      hotel_id: room_split[0],
      room_number: room_split[1],
    };
  });

  // turn the array into an array of tuples
  // for example: [{hotel_id: 6253ca0c6f749618a8d022af, room_number: 1234}] => [["6253ca0c6f749618a8d022af", "1234"]]

  rooms = rooms.map((room) => {
    return [room.hotel_id, room.room_number, room.amenity_id];
  });

  console.log(rooms);
  Amenity.assignAmenityToRoom(rooms, (err, amenity) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).json({
          message: `Amenity with id ${amenity_id} not found`,
        });
      }
    }

    return res.status(200).json({
      message: "Amenity assigned successfully",
      amenity: amenity,
    });
  });
};

exports.unassignAmenityToRoom = (req, res, next) => {
  const amenity_id = req.params.amenity_id;

  let rooms = req.body.rooms;

  // split the rooms array before and after the hyphen to get the hotel_id and room_number and create an array of objects
  // for example: 6253ca0c6f749618a8d022af-1234 => [{hotel_id: 6253ca0c6f749618a8d022af, room_number: 1234}]

  rooms = rooms.map((room) => {
    const room_split = room.split("-");
    return {
      amenity_id: amenity_id,
      hotel_id: room_split[0],
      room_number: room_split[1],
    };
  });

  // turn the array into an array of tuples
  // for example: [{hotel_id: 6253ca0c6f749618a8d022af, room_number: 1234}] => [["6253ca0c6f749618a8d022af", "1234"]]

  rooms = rooms.map((room) => {
    return [room.hotel_id, room.room_number, room.amenity_id];
  });

  console.log(rooms);
  Amenity.unassignAmenityToRoom(rooms, (err, amenity) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).json({
          message: `Amenity with id ${amenity_id} not found`,
        });
      }
    }

    return res.status(200).json({
      message: "Amenity assigned successfully",
      amenity: amenity,
    });
  });
};
exports.updateAmenity = (req, res, next) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }
  console.log(req.body);
  Amenity.updateAmenity(req.params.id, new Amenity(req.body), (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `No Amenity found with ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error updating Hotel with id " + req.params.id,
        });
      }
    } else res.send(data);
  });
};

exports.deleteAmenity = (req, res, next) => {
  const amenity_id = req.params.id;

  Amenity.delete(amenity_id, (err, amenity) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).json({
          message: `Amenity with id ${amenity_id} not found`,
        });
      }
    }

    return res.status(200).json({
      message: "Amenity deleted successfully",
      amenity: amenity,
    });
  });
};

exports.deleteAll = (req, res, next) => {
  Amenity.deleteAll((err, amenity) => {
    if (err) {
      return res.status(500).json({
        message: "Deleting amenities failed",
      });
    }

    return res.status(200).json({
      message: "Amenities deleted successfully",
      amenity: amenity,
    });
  });
};
