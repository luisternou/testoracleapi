const oracledb = require('oracledb');


let keys = ["amenity_id", "amenity_name"]

// constructor

const Amenity = function (amenity) {
  this.amenity_id = amenity.amenity_id;
  this.amenity_name = amenity.amenity_name;
};

Amenity.addAmenity = (new_amenity, result) => {
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
      `INSERT INTO amenity VALUES ('${new_amenity.amenity_id}', '${new_amenity.amenity_name}')`,
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

Amenity.getAll = (result) => {
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
      `SELECT * FROM amenity`,
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }
        let temp = res.rows;
        let temp_result = []
        temp.map((hotel) => {
            let obj = {}
            keys.map((key, i) => {
                obj[key] = hotel[i]

            })
            temp_result.push(obj)
        })
        
        
        result(null, temp_result);
      }
    );
  });
};

Amenity.getById = (amenity_id, result) => {
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
      `SELECT * FROM amenity WHERE amenity_id = '${amenity_id}'`,
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }
        let temp = res.rows;
        let temp_result = []
        temp.map((hotel) => {
            let obj = {}
            keys.map((key, i) => {
                obj[key] = hotel[i]

            })
            temp_result.push(obj)
        })
        
        
        result(null, temp_result);
      }
    );
  });
};

Amenity.getByName = (amenity_name, result) => {
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
      `SELECT * FROM amenity WHERE amenity_name = '${amenity_name}'`,
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }
        let temp = res.rows;
        let temp_result = []
        temp.map((hotel) => {
            let obj = {}
            keys.map((key, i) => {
                obj[key] = hotel[i]

            })
            temp_result.push(obj)
        })
        
        
        result(null, temp_result);
      }
    );
  });
};

Amenity.getAllAmenitiesOfRoom = (hotel_id, room_number, result) => {
  // get all amenities of a room by room_number and hotel_id
  
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
      `SELECT a.amenity_name FROM Room_Amenity r JOIN Amenity a ON r.amenity_id = a.amenity_id WHERE r.hotel_id = '${hotel_id}' AND r.room_number = '${room_number}'`,
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }
        let temp = res.rows;
        let temp_result = []
        temp.map((hotel) => {
            let obj = {}
            keys.map((key, i) => {
                obj[key] = hotel[i]

            })
            temp_result.push(obj)
        })
        
        
        result(null, temp_result);
      }
    );
  });
  

};

Amenity.assignAmenityToRoom = (rooms, result) => {
  // check if a room with the same amenity_id already exists and if yes, do not add it again
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
      `INSERT INTO room_amenity (hotel_id, room_number, amenity_id) VALUES ?`,
      [rooms],
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

Amenity.unassignAmenityToRoom = (rooms, result) => {
  // delete the room_amenity with the same amenity_id and room_number and hotel_id for every room in the array
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
      `DELETE FROM room_amenity WHERE hotel_id = '${rooms[0][0]}' AND room_number = '${rooms[0][1]}' AND amenity_id = '${rooms[0][2]}'`,
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

Amenity.updateAmenity = (amenity_id, amenity, result) => {
 
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
      `UPDATE amenity SET amenity_name = '${amenity.amenity_name}' WHERE amenity_id = '${amenity_id}'`,
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

Amenity.delete = (amenity_id, result) => {
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
      `DELETE FROM amenity WHERE amenity_id = '${amenity_id}'`,
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

Amenity.deleteAll = (result) => {
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
      `DELETE FROM amenity`,
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

module.exports = Amenity;
