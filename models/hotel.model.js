const res = require('express/lib/response');
const oracledb = require('oracledb');


let keys = ["hotel_id", "hotel_name", "stars", "number_room", "street_number", "streetname", "postal_code", "city", "country", "description", "photo_url"]
let city_keys = ["city"]


const Hotel = function (hotel) {
    this.hotel_id = hotel.hotel_id;
    this.hotel_name = hotel.hotel_name;
    this.stars = hotel.stars;
    this.number_room = hotel.number_room;
    this.street_number = hotel.street_number;
    this.street_name = hotel.street_name;
    this.postal_code = hotel.postal_code;
    this.city = hotel.city;
    this.country = hotel.country;
    this.description = hotel.description;
    this.photo_url = hotel.photo_url;
  };






  Hotel.addHotel = (newHotel, result) => {
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
        `INSERT INTO hotel VALUES ('${newHotel.hotel_id}', '${newHotel.hotel_name}', ${newHotel.stars}, ${newHotel.number_room},'${newHotel.street_number}', '${newHotel.street_name}', '${newHotel.postal_code}', '${newHotel.city}', '${newHotel.country}', '${newHotel.description}', '${newHotel.photo_url}')`,
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


  
  Hotel.getAll = (result) => {
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
        `SELECT * FROM hotel`,
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




  Hotel.getById = (id, result) => {
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
        `SELECT * FROM hotel WHERE hotel_id = '${id}'`,
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
          
          
          result(null, temp_result[0]);
        }
      );
    });
  };

  Hotel.getAllCities = (result) => {
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
        `SELECT Distinct city FROM hotel`,
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
              city_keys.map((key, i) => {
                  obj[key] = hotel[i]

              })
              temp_result.push(obj)
          })
          
          
          result(null, temp_result);
        }
      );
    });
  };

// TODO 
  Hotel.getHotelSearch = (search, result) => {
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

      console.log(`SELECT DISTINCT * FROM Hotel WHERE city Like '%${search.city}%' AND hotel_id IN (SELECT hotel_id FROM Room WHERE room_number NOT IN (SELECT room_number FROM Booking WHERE check_in <= '${search.checkin}' AND check_out >= '${search.checkout}'))`);
   
      connection.execute(
        `SELECT DISTINCT * FROM Hotel WHERE city Like '%${search.city}%' AND hotel_id IN (SELECT hotel_id FROM Room WHERE room_number NOT IN (SELECT room_number FROM Booking WHERE check_in <= '${search.checkin}' AND check_out >= '${search.checkout}'))`,
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
          
          
          result(null, temp_result[0]);
        }
      );
    });
  };
  // TODO 

  Hotel.getStats = (id, result) => {
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
        `SELECT * FROM hotel WHERE hotel_id = '${id}'`,
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
          
          
          result(null, temp_result[0]);
        }
      );
    });
  };
  
// TODO update hotel

Hotel.updateById = (id , hotel, result) => {
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
        `UPDATE hotel SET hotel_name = '${hotel.hotel_name}', stars = '${hotel.stars}', number_room = '${hotel.number_room}', street_number = '${hotel.street_number}', street_name = '${hotel.street_name}', postal_code = '${hotel.postal_code}', city = '${hotel.city}', country = '${hotel.country}', description = '${hotel.description}', photo_url = '${hotel.photo_url}'  WHERE hotel_id = '${id}'`,
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





Hotel.remove = (id, result) => {
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
   console.log(`DELETE FROM hotel WHERE hotel_id = '${id}'`);
      connection.execute(
        `DELETE FROM hotel WHERE hotel_id = '${id}'`,
        (err, res) => {
          if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
          }
          
          connection.execute("commit");
          
          result(null, res);
        }
      );
    });
  };

  Hotel.removeAll = (result) => {
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
        `DELETE FROM hotel`,
        (err, res) => {
          if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
          }
          
          connection.execute("commit");
          
          result(null, res);
        }
      );
    });
  };



  module.exports = Hotel;