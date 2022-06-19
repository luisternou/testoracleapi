const oracledb = require('oracledb');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { connect } = require('../routes/hotel.route');

let keys = ["guest_id", "token", "expires"]

const Guest_Password_Token = function (Guest_Password_Token) {
  this.guest_id = Guest_Password_Token.guest_id;
  this.token = Guest_Password_Token.token;
  this.expires = Guest_Password_Token.expires;
};

Guest_Password_Token.addToken = (new_Guest_Password_Token, result) => {
  // if Guest_Password_Token exists, delete Guest_Password_Token and add new Guest_Password_Token

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
        `SELECT * FROM Guest_Password_Token WHERE guest_id = "${new_Guest_Password_Token.guest_id}"`,
        (err, res) => {
          if (err) {
            console.error("error: ", err);
            result(err, null);
            return;
          }

          if (res.length) {
            connection.execute(
              `DELETE FROM Guest_Password_Token WHERE guest_id = "${new_Guest_Password_Token.guest_id}"`,
              (err, res) => {
                if (err) {
                  console.error("error: ", err);
                  result(err, null);
                  return;
                }

                // if Guest_Password_Token does not exist, add new Guest_Password_Token
                connection.execute(
                  "INSERT INTO Guest_Password_Token SET ?",
                  new_Guest_Password_Token,
                  (err, res) => {
                    if (err) {
                      console.error("error: ", err);
                      result(err, null);
                      return;
                    }

                    console.log("created Guest_Password_Token: ", {
                      admin_id: res.insertId,
                      ...new_Guest_Password_Token,
                    });
                    result(null, {
                      admin_id: res.insertId,
                      ...new_Guest_Password_Token,
                    });
                  }
                );
              }
            );
          } else {

            // if Guest_Password_Token does not exist, add new Guest_Password_Token
            connection.execute(
              "INSERT INTO Guest_Password_Token SET ?",
              new_Guest_Password_Token,
              (err, res) => {
                if (err) {
                  console.error("error: ", err);
                  result(err, null);
                  return;
                }

                console.log("created Guest_Password_Token: ", {
                  admin_id: res.insertId,
                  ...new_Guest_Password_Token,
                });
                result(null, {
                  admin_id: res.insertId,
                  ...new_Guest_Password_Token,
                });
              }
            );
          }
        }
      );
    }
  );
};

Guest_Password_Token.getToken = (reset_token, result) => {
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
      `SELECT * FROM Guest_Password_Token WHERE token = "${reset_token}"`,
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

Guest_Password_Token.deleteToken = (guest_id, result) => {
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
      `DELETE FROM Guest_Password_Token WHERE guest_id = "${guest_id}" `,
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

module.exports = Guest_Password_Token;
