const oracledb = require('oracledb');

let keys = ["payment_id", "amount", "date_of_payment", "booking_id", "guest_id" ]

// constructor
const Payment = function (payment) {
  this.payment_id = payment.payment_id;
  this.amount = payment.amount;
  this.date_of_payment = payment.date_of_payment;
  this.booking_id = payment.booking_id;
  this.guest_id = payment.guest_id;
};

Payment.addPayment = (newPayment, result) => {
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
      `INSERT INTO payment VALUES ('${newPayment.payment_id}', ${newPayment.amount}, '${newPayment.date_of_payment}', '${newPayment.booking_id}','${newPayment.guest_id}')`,
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

Payment.findById = (paymentId, result) => {
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
      `SELECT * FROM payment WHERE payment_id = "${paymentId}"`,
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

Payment.getPaymentByBookingId = (bookingId, result) => {
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
      `SELECT * FROM payment WHERE booking_id = "${bookingId}"`,
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

Payment.getPaymentByGuestId = (guestId, result) => {
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
      `SELECT * FROM payment WHERE guest_id = "${guestId}"`,
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

Payment.getAll = (result) => {
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
      `SELECT * FROM payment`,
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

Payment.updateById = (id, payment, result) => {
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
      `UPDATE payment SET amount = ${payment.amount}, date_of_payment = '${payment.date_of_payment}', guest_id = '${payment.guest_id}', booking_id = '${payment.booking_id}'  WHERE hotel_id = '${id}'`,
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

Payment.remove = (id, result) => {
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
      `DELETE FROM payment WHERE "payment_id = "${id}"`,
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

Payment.removeAll = (result) => {
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
      `DELETE FROM payment`,
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

module.exports = Payment;
