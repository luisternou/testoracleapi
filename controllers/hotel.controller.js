const Hotel = require("../models/hotel.model");
const objectId = require("../utils/objectid");

exports.addHotel = (req, res, next) => {
    if (
      !req.body.hotel_name ||
      !req.body.stars ||
      !req.body.number_room ||
      !req.body.street_number ||
      !req.body.street_name ||
      !req.body.city ||
      !req.body.country ||
      !req.body.postal_code ||
      !req.body.photo_url
    ) {
      return res.status(400).json({
        message: "Please provide all fields",
      });
    }
  
    const new_id = objectId();
    const hotel = new Hotel({
      hotel_id: new_id,
      hotel_name: req.body.hotel_name,
      stars: req.body.stars,
      number_room: req.body.number_room,
      street_number: req.body.street_number,
      street_name: req.body.street_name,
      postal_code: req.body.postal_code,
      city: req.body.city,
      country: req.body.country,
      description: req.body.description,
      photo_url: req.body.photo_url,
    });
  
    Hotel.addHotel(hotel, (err, hotel) => {
      if (err) {
        return res.status(500).json({
          message: "Hotel creation failed",
        });
      }
  
      return res.status(201).json({
        message: "Hotel created successfully",
        hotel: hotel,
      });
    });
  };

exports.getHotels = (req, res, next) => {
    Hotel.getAll((err, hotels) => {
      if (err) {
        return res.status(500).json({
          message: "Fetching hotels failed",
        });
      }
  
      return res.status(200).json({
        message: "Hotels fetched successfully",
        hotels: hotels,
      });
    });
  };


  exports.getHotelById = (req, res, next) => {
    const id = req.params.id
    Hotel.getById(id, (err, hotels) => {
      if (err) {
        return res.status(500).json({
          message: "Fetching hotels failed",
        });
      }
  
      return res.status(200).json({
        message: "Hotels fetched successfully",
        hotels: hotels,
      });
    });
  };

  exports.getHotelCity = (req, res, next) => {
    Hotel.getAllCities((err, hotels) => {
      if (err) {
        return res.status(500).json({
          message: "Fetching hotels failed",
        });
      }
  
      return res.status(200).json({
        message: "Hotels fetched successfully",
        hotels: hotels,
      });
    });
  };


  exports.getHotelSearch = (req, res, next) => {
    const search = req.params.search;
  
    // decode the search string from base64 to json
    const search_json = JSON.parse(
      Buffer.from(search, "base64").toString("utf8")
    );
  
    Hotel.getHotelSearch(search_json, (err, hotels) => {
      if (err) {
        return res.status(500).json({
          message: "Fetching hotels failed",
        });
      }
  
      // if no hotels found
      if (!hotels || hotels.length === 0) {
        return res.status(404).json({
          message: "No hotels found",
        });
      }
  
      return res.status(200).json({
        message: "Hotels fetched successfully",
        hotels: hotels,
      });
    });
  };
  
  exports.getStats = (req, res, next) => {
    const hotelId = req.params.id;
  
    Hotel.getStats(hotelId, (err, stats) => {
      if (err) {
        if (err.kind === "not_found") {
          return res.status(404).json({
            message: `Hotel with id ${hotelId} not found`,
          });
        } else {
          return res.status(500).json({
            message: "Error retrieving hotel with id " + hotelId,
          });
        }
      }
  
      return res.status(200).json({
        message: "Hotel stats fetched successfully",
        stats: stats,
      });
    });
  };


  exports.updateHotel = (req, res, next) => {
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!",
      });
    }
    console.log(req.body);
    Hotel.updateById(req.params.id, new Hotel(req.body), (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `No hotel found with ${req.params.id}.`,
          });
        } else {
          res.status(500).send({
            message: "Error updating Hotel with id " + req.params.id,
          });
        }
      } else res.send(data);
    });
  };
  
  exports.deleteHotel = (req, res, next) => {
    const hotelId = req.params.id;
  
    Hotel.remove(hotelId, (err, hotel) => {
      if (err) {
        if (err.kind === "not_found") {
          return res.status(404).json({
            message: `Hotel with id ${hotelId} not found`,
          });
        } else {
          return res.status(500).json({
            message: "Could not delete hotel with id " + hotelId,
          });
        }
      }
  
      return res.status(200).json({
        message: "Hotel deleted successfully",
      });
    });
  };
  
  exports.deleteAll = (req, res, next) => {
    Hotel.removeAll((err, hotels) => {
      if (err) {
        return res.status(500).json({
          message: "Could not delete hotels",
        });
      }
  
      return res.status(200).json({
        message: "Hotels deleted successfully",
      });
    });
  };
  