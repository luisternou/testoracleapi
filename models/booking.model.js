const oracledb = require('oracledb');

let keys = ["boking_id", "amount", "check_in", "check_out", "guests", "open_amount", "guest_id", "hotel_id", "room_number" ]
let booking_keys = ["boking_id", "amount", "check_in", "check_out", "guests", "open_amount", "guest_id", "hotel_id", "room_number", "hotel_name", "hotel_id" ]
let name_keys = ["boking_id", "amount", "check_in", "check_out", "guests", "open_amount", "guest_id", "hotel_id", "room_number", "hotel_name" ]



// constructor
const Booking = function (booking) {
  this.booking_id = booking.booking_id;
  this.amount = booking.amount;
  this.check_in = booking.check_in;
  this.check_out = booking.check_out;
  this.guests = booking.guests;
  this.open_amount = booking.open_amount;
  this.guest_id = booking.guest_id;
  this.hotel_id = booking.hotel_id;
  this.room_number = booking.room_number;
};

Booking.addBooking = (newBooking, result) => {
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
      `INSERT INTO booking VALUES ('${newBooking.booking_id}', '${newBooking.amount}', ${newBooking.check_in}, ${newBooking.check_out},'${newBooking.guests}', '${newBooking.open_amount}', '${newBooking.guest_id}', '${newBooking.hotel_id}', '${newBooking.room_number}')`,
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

Booking.findById = (bookingId, result) => {
  
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
      `SELECT b.*, h.hotel_name, h.hotel_id FROM booking b JOIN hotel h ON b.hotel_id = h.hotel_id WHERE booking_id = "${bookingId}"`,
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
            booking_keys.map((key, i) => {
                obj[key] = hotel[i]

            })
            temp_result.push(obj)
        })
        
        
        result(null, temp_result);
      }
    );
  });



};

Booking.getBookingByHotelId = (hotelId, result) => {
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
      `SELECT b.booking_id, b.amount, b.check_in, b.check_out, b.guests, b.open_amount, b.guest_id, b.hotel_id, b.room_number, h.hotel_name FROM Booking b JOIN Hotel h on b.hotel_id = h.hotel_id WHERE b.hotel_id = "${hotelId}"`,
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
            name_keys.map((key, i) => {
                obj[key] = hotel[i]

            })
            temp_result.push(obj)
        })
        
        
        result(null, temp_result);
      }
    );
  });
  

};

Booking.getBookingByRoom = (roomNumber, hotel_id, result) => {
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
      `SELECT * FROM booking WHERE room_number = ${roomNumber} AND hotel_id = "hotel_id"`,
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

Booking.getBookingByCheckinDate = (checkIn, result) => {
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
      `SELECT * FROM booking WHERE check_in = "${checkIn}"`,
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

Booking.getBookingByCheckoutDate = (checkOut, result) => {
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
      `SELECT * FROM booking WHERE check_out = "${checkOut}"`,
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

Booking.getBookingByGuestId = (guestId, result) => {
  
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
      `SELECT b.*, h.hotel_name, h.hotel_id FROM booking b JOIN hotel h ON b.hotel_id = h.hotel_id WHERE guest_id = '${guestId}'`,
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
            booking_keys.map((key, i) => {
                obj[key] = hotel[i]

            })
            temp_result.push(obj)
        })
        
        
        result(null, temp_result);
      }
    );
  });
  
 
};

Booking.getByOpenAmount = (result) => {
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
      `SELECT * FROM booking WHERE open_amount > 0`,
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
    

Booking.getBookingByRoom = (roomNumber, hotel_id, result) => {
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
      `SELECT * FROM booking WHERE room_number = ${room_number} AND hotel_id = "${hotel_id}"`,
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

Booking.getAll = (result) => {
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
      `SELECT * FROM booking`,
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

Booking.updateById = (id, booking, result) => {
 
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
      `UPDATE booking SET amount = '${booking.amount}', check_in = '${booking.check_in}', check_out = '${booking.check_out}', guests = '${booking.guests}', open_amount = '${booking.open_amount}'  WHERE booking_id = "${id}"`,
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

Booking.remove = (id, result) => {
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
      `DELETE FROM booking WHERE booking_id = "${booking}"`,
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

Booking.removeAll = (result) => {
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
      `DELETE FROM booking`,
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

module.exports = Booking;
