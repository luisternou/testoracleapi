const oracledb = require('oracledb');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

let keys = ["guest_id", "name", "dob", "email", "password"]


// constructor

const Guest = function (guest) {
  this.guest_id = guest.guest_id;
  this.name = guest.name;
  this.dob = guest.dob;
  this.email = guest.email;
  this.password = guest.password;
};

Guest.addGuest = (new_guest, result) => {
  
// check if a guest with the same email already exists in the database, if yes, return an error else insert the guest into the database
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
      `SELECT * FROM guest WHERE email = '${new_guest.email}'`,
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }
        if (res.rows.length) {
          result({ kind: "duplicate" }, null);
          return;
        }
        connection.execute(
          `INSERT INTO guest (guest_id, name, dob, email, password) VALUES (guest_seq.nextval, '${new_guest.name}', '${new_guest.dob}', '${new_guest.email}', '${new_guest.password}')`,
          (err, res) => {
            if (err) {
              console.log("error: ", err);
              result(err, null);
              return;
            }
            result(null, new_guest);
          }
        );
      }
    );
  }
);
};

Guest.login = (email, password, result) => {


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
        `SELECT * FROM guest WHERE email = '${email}'`,
        (err, res) => {
          if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
          }
          if (res.rows.length) {
            const guest = res.rows[0];
            const isPasswordValid = bcrypt.compareSync(password, guest.password);

            if (!isPasswordValid) {
              console.error("error: ", err);
              result({ kind: "password_incorrect" }, null);
              return;
            }

            const token = jwt.sign(
              {
                guest_id: guest.guest_id,
                name: guest.name,
                email: guest.email,
                dob: guest.dob,
              },
              process.env.JWT_SECRET,
              {
                expiresIn: "1h",
              }
            );

            console.log("logged in guest: ", guest);
            result(null, token);
          } else {
            console.error("error: ", err);
            result({ kind: "user_not_found" }, null);
          }
        }
      );
    }
  );
};

Guest.getAll = (result) => {
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
      `SELECT * FROM guest`,
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

Guest.getById = (guest_id, result) => {
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
      `SELECT * FROM guest WHERE guest_id = '${guest_id}'`,
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

Guest.updatePassword = (token, password, result) => {

  // update the password of the guest with the given token in the database using this query:
  // UPDATE guest SET password = "${password}" WHERE (SELECT guest_id FROM guest_password_token WHERE token = "${token}")
  // delete the token from the database using this query:
  // DELETE FROM guest_password_token WHERE token = "${token}"

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

    connection.execute(`UPDATE guest SET password = "${password}" WHERE (SELECT guest_id FROM guest_password_token WHERE token = '${token}')`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      connection.execute(`DELETE FROM guest_password_token WHERE token = '${token}'`, (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }
        connection.execute("commit")

        result(null, { message: "password updated" });
      }
    );
  }
  );
  }
  );
};

Guest.getByEmail = (email, result) => {
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
      `SELECT * FROM guest WHERE email = "${email}"`,
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

Guest.getByName = (guest_name, result) => {
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
      `SELECT * FROM guest WHERE name = "${guest_name}"`,
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

Guest.getByDOB = (dob, result) => {
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
      `SELECT * FROM guest WHERE dob = "${dob}"`,
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

Guest.updateGuest = (guest_id, guest, result) => {
  // update name and dob
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

    connection.execute(`UPDATE guest SET name = "${guest.name}", dob = "${guest.dob}", email = "${guest.email}" WHERE guest_id = "${guest_id}"`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      connection.execute("commit")

      result(null, { message: "guest updated" });
    }
  );
  }
  );
};

Guest.updateGuestProfile = (guest_id, guest, result) => {
  //update the guest with the query UPDATE guest SET name = "${guest.name}", dob = "${guest.dob}", email = "${guest.email}", password = "${guest.password}" WHERE guest_id = "${guest_id}"
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

    connection.execute(`UPDATE guest SET name = '${guest.name}', dob = '${guest.dob}', email = '${guest.email}', password = '${guest.password}' WHERE guest_id = '${guest_id}'` , (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      connection.execute("commit")

     
      result(null, { ...guest });
    }
    );
  }
  );

};

Guest.delete = (guest_id, result) => {
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
      `DELETE FROM guest WHERE guest_id = "${guest_id}"`,
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

Guest.deleteAll = (result) => {
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
      `DELETE FROM guest`,
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

module.exports = Guest;
