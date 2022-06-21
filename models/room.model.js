
const oracledb = require('oracledb');
// constructor
let keys = ["room_number", "number_guests", "area", "type", "hotel_id", "price", "conected_room_number", "conected_room_hotel_id"] 
let amenity_keys = ["amenity_name", "room_number", "hotel_id"]
const Room = function (room) {
  this.room_number = room.room_number;
  this.number_guests = room.number_guests;
  this.area = room.area;
  this.type = room.type;
  this.price = room.price;
  this.hotel_id = room.hotel_id;
  this.conected_room_hotel_id = room.conected_room_hotel_id;
};

Room.addRoom = (newRoom, result) => {
  oracledb.getConnection({
    user: "a01649986",
    password: "dbs22",
    connectString: "oracle-lab.cs.univie.ac.at:1521/lab",
  }, 
    (err, connection) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    
    console.log( `INSERT INTO room VALUES (${newRoom.room_number}, ${newRoom.number_guests}, ${newRoom.area}, '${newRoom.type}','${newRoom.hotel_id}', ${newRoom.price}, NULL, '${newRoom.conected_room_hotel_id}')`);
 
    connection.execute(
      `INSERT INTO room VALUES (${newRoom.room_number}, ${newRoom.number_guests}, ${newRoom.area}, '${newRoom.type}','${newRoom.hotel_id}', ${newRoom.price}, NULL, '${newRoom.conected_room_hotel_id}')`,
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }
   
        connection.execute("commit")
        
        result(null, res);
      }
    );
  });
};

Room.getAll = (result) => {
  oracledb.getConnection({
    user: "a01649986",
    password: "dbs22",
    connectString: "oracle-lab.cs.univie.ac.at:1521/lab",
  }, 
    (err, connection) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
 
    connection.execute(
      `SELECT * FROM room`,
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }
        let temp = res.rows;
        let temp_result = []
        temp.map((room) => {
            let obj = {}
            keys.map((key, i) => {
                obj[key] = room[i]

            })
            temp_result.push(obj)
        })
        
        
        result(null, temp_result);
      }
    );
  });
};


Room.findById = (hotel_id, room_number, result) => {
  oracledb.getConnection({
    user: "a01649986",
    password: "dbs22",
    connectString: "oracle-lab.cs.univie.ac.at:1521/lab",
  }, 
    (err, connection) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    connection.execute(
      `SELECT * FROM room WHERE hotel_id = '${hotel_id}' AND room_number = ${room_number}`,
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }
        let temp = res.rows;
        let temp_result = []
        temp.map((room) => {
            let obj = {}
            keys.map((key, i) => {
                obj[key] = room[i]

            })
            temp_result.push(obj)
        })
        
        
        result(null, temp_result);
      }
    );
  });
};

Room.findByHotelId = (hotelId, result) => {
  oracledb.getConnection({
    user: "a01649986",
    password: "dbs22",
    connectString: "oracle-lab.cs.univie.ac.at:1521/lab",
  }, 
    (err, connection) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
 
    connection.execute(
      `SELECT * FROM room WHERE hotel_id = '${hotelId}'`,
      (err, res) => {
        if (err) {
          
          console.log("error: ", err);
          result(err, null);
          return;
        }
        let temp = res.rows;
        let temp_result = []
        temp.map((room) => {
            let obj = {}
            keys.map((key, i) => {
                obj[key] = room[i]

            })
            temp_result.push(obj)
        })
        
        
        result(null, temp_result);
      }
    );
  });
};



Room.findByRoomType = (roomType, hotel_id, result) => {
  oracledb.getConnection({
    user: "a01649986",
    password: "dbs22",
    connectString: "oracle-lab.cs.univie.ac.at:1521/lab",
  }, 
    (err, connection) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
 
    connection.execute(
      `SELECT * FROM room WHERE hotel_id = '${hotel_id} AND type = '${roomType}'`,
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }
        let temp = res.rows;
        let temp_result = []
        temp.map((room) => {
            let obj = {}
            keys.map((key, i) => {
                obj[key] = room[i]

            })
            temp_result.push(obj)
        })
        
        
        result(null, temp_result);
      }
    );
  });
};

Room.findRoomByArea = (area, result) => {
  oracledb.getConnection({
    user: "a01649986",
    password: "dbs22",
    connectString: "oracle-lab.cs.univie.ac.at:1521/lab",
  }, 
    (err, connection) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
 
    connection.execute(
      `SELECT * FROM room WHERE area >= ${area}`,
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }
        let temp = res.rows;
        let temp_result = []
        temp.map((room) => {
            let obj = {}
            keys.map((key, i) => {
                obj[key] = room[i]

            })
            temp_result.push(obj)
        })
        
        
        result(null, temp_result);
      }
    );
  });
};

Room.getAvailableRooms = (hotel_id, checkin, checkout, result) => {
  oracledb.getConnection({
    user: "a01649986",
    password: "dbs22",
    connectString: "oracle-lab.cs.univie.ac.at:1521/lab",
  }, 
    (err, connection) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
 
    connection.execute(
      `SELECT * FROM room WHERE hotel_id = '${hotel_id}' AND room_number NOT IN (SELECT room_number FROM Booking WHERE hotel_id = '${hotel_id}' AND (check_in BETWEEN '${checkin}' AND '${checkout}' OR check_out BETWEEN '${checkin}' AND '${checkout}'))`,
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }
        let temp = res.rows;
        let temp_result = []
        temp.map((room) => {
            let obj = {}
            keys.map((key, i) => {
                obj[key] = room[i]

            })
            temp_result.push(obj)
        })
        
        
        result(null, temp_result);
      }
    );
  });

};

Room.findByNumberGuests = (nrGuests, result) => {
  oracledb.getConnection({
    user: "a01649986",
    password: "dbs22",
    connectString: "oracle-lab.cs.univie.ac.at:1521/lab",
  }, 
    (err, connection) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
 
    connection.execute(
      `SELECT * FROM room WHERE nr_guests >= ${nrGuests}`,
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }
        let temp = res.rows;
        let temp_result = []
        temp.map((room) => {
            let obj = {}
            keys.map((key, i) => {
                obj[key] = room[i]

            })
            temp_result.push(obj)
        })
        
        
        result(null, temp_result);
      }
    );
  });
};



Room.getAmenities = (hotel_id, room_number, result) => {
  oracledb.getConnection({
    user: "a01649986",
    password: "dbs22",
    connectString: "oracle-lab.cs.univie.ac.at:1521/lab",
  }, 
    (err, connection) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
 
    connection.execute(
      `SELECT a.amenity_name, r.room_number, r.hotel_id FROM Room_Amenity r JOIN Amenity a ON a.amenity_id = r.amenity_id WHERE hotel_id = '${hotel_id}' AND room_number = '${room_number}'`,
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }
        let temp = res.rows;
        let temp_result = []
        temp.map((room) => {
            let obj = {}
            amenity_keys.map((key, i) => {
                obj[key] = room[i]

            })
            temp_result.push(obj)
        })
        
        
        result(null, temp_result);
      }
    );
  });

};

Room.updateRoom = (room_number, hotel_id, room, result) => {
  console.log("connected_room: ", room.roomsToAssign);
  if (room.roomsToAssign) {
    
    oracledb.getConnection({
      user: "a01649986",
      password: "dbs22",
      connectString: "oracle-lab.cs.univie.ac.at:1521/lab",
    }, 
      (err, connection) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      
   
      connection.execute(
        `UPDATE room SET number_guests = '${room.number_guests}', area = '${room.area}, type = '${room.type}, price = '${room.price}, conected_room_hotel_id = '${hotel_id}, conected_room_number = '${room.roomsToAssign} WHERE room_number = '${room_number}' AND hotel_id = '${hotel_id}'`,
        (err, res) => {
          if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
          }
     
          connection.execute("commit")
          
          result(null, res);
        }
      );
    });
    
    

  } else {
    oracledb.getConnection({
      user: "a01649986",
      password: "dbs22",
      connectString: "oracle-lab.cs.univie.ac.at:1521/lab",
    }, 
      (err, connection) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      
   
      connection.execute(
        `UPDATE room SET number_guests = '${room.number_guests}', area = '${room.area}', type = '${room.area}', price = '${room.price}' WHERE room_number = '${room_number}' AND hotel_id = '${hotel_id}'`,
        (err, res) => {
          if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
          }
     
          connection.execute("commit")
          
          result(null, res);
        }
      );
    });


 
  }
};

Room.deleteById = (room_number, hotel_id, result) => {
  oracledb.getConnection({
    user: "a01649986",
    password: "dbs22",
    connectString: "oracle-lab.cs.univie.ac.at:1521/lab",
  }, 
    (err, connection) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
 
    connection.execute(
      `DELETE FROM room WHERE hotel_id = '${hotel_id}' AND room_number = ${room_number}`,
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }

        
        
        result(null, res);
      }
    );
  });
};

Room.deleteAll = (result) => {
  oracledb.getConnection({
    user: "a01649986",
    password: "dbs22",
    connectString: "oracle-lab.cs.univie.ac.at:1521/lab",
  }, 
    (err, connection) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
 
    connection.execute(
      `DELETE FROM room`,
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }
        
        
        result(null, res);
      }
    );
  });
};

module.exports = Room;
