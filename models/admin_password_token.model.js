const oracledb = require('oracledb');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { connect } = require('../routes/hotel.route');

let keys = ["employee_id", "token", "expires"]

const Admin_Password_Token = function (admin_password_token) {
  this.employee_id = admin_password_token.employee_id;
  this.token = admin_password_token.token;
  this.expires = admin_password_token.expires;
};

Admin_Password_Token.addToken = (new_admin_password_token, result) => {
  // if admin_password_token exists, delete admin_password_token and add new admin_password_token

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
        `SELECT * FROM admin_password_token WHERE employee_id = '${new_admin_password_token.employee_id}'`,
        (err, res) => {
          if (err) {
            console.error("error: ", err);
            result(err, null);
            return;
          }

          if (res.length) {
            connection.execute(
              `DELETE FROM admin_password_token WHERE employee_id = '${new_admin_password_token.employee_id}'`,
              (err, res) => {
                if (err) {
                  console.error("error: ", err);
                  result(err, null);
                  return;
                }

                // if admin_password_token does not exist, add new admin_password_token
                connection.execute(
                  "INSERT INTO admin_password_token SET ?",
                  new_admin_password_token,
                  (err, res) => {
                    if (err) {
                      console.error("error: ", err);
                      result(err, null);
                      return;
                    }

                    console.log("created admin_password_token: ", {
                      admin_id: res.insertId,
                      ...new_admin_password_token,
                    });
                    result(null, {
                      admin_id: res.insertId,
                      ...new_admin_password_token,
                    });
                  }
                );
              }
            );
          } else {

            // if admin_password_token does not exist, add new admin_password_token
            connection.execute(
              "INSERT INTO admin_password_token SET ?",
              new_admin_password_token,
              (err, res) => {
                if (err) {
                  console.error("error: ", err);
                  result(err, null);
                  return;
                }

                console.log("created admin_password_token: ", {
                  admin_id: res.insertId,
                  ...new_admin_password_token,
                });
                result(null, {
                  admin_id: res.insertId,
                  ...new_admin_password_token,
                });
              }
            );
          }
        }
      );
    }
  );
};

Admin_Password_Token.getToken = (reset_token, result) => {
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
      `SELECT * FROM Admin_Password_token WHERE token = '${reset_token}'`,
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

Admin_Password_Token.deleteToken = (employee_id, result) => {
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
      `DELETE FROM Admin_Password_Token WHERE employee_id = '${employee_id}' `,
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

module.exports = Admin_Password_Token;
