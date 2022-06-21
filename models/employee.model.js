const oracledb = require('oracledb');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
let keys = ["employee_id", "dob", "name", "position", "hotel_id", "hotel_name"]
let no_hotel_name_keys = ["employee_id", "dob", "name", "position", "hotel_id"]
let house_keeping_staff_keys = ["employee_id", "experience"]
let butler_staff_keys = ["employee_id", "hotel_id", "room_number"]
// constructor

const Employee = function (employee) {
  this.employee_id = employee.employee_id;
  this.dob = employee.dob;
  this.name = employee.name;
  this.position = employee.position;
  this.email = employee.email;
  this.password = employee.password;
  this.hotel_id = employee.hotel_id;
};

Employee.addEmployee = (newEmployee, result) => {

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
      `INSERT INTO employee (employee_id, dob, name, position, hotel_id) VALUES ('${newEmployee.employee_id}', '${newEmployee.dob}', '${newEmployee.name}', '${newEmployee.position}', '${newEmployee.hotel_id}') `,
      (err, res) => {
        if (err) {
          console.log("here");
          console.log("error: ", err);
          result(err, null);
          return;
        }

        console.log(newEmployee.position);

        if (newEmployee.position == "admin") {
          connection.execute(
            `INSERT INTO admin_staff (employee_id, email, password) VALUES (?, ?, ?)`,
            [newEmployee.employee_id, newEmployee.email, newEmployee.password],
            (err, res) => {
              if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
              }

              result(null, {
                id: res.insertId,
                ...newEmployee,
              });
            }
          );
        } else if (newEmployee.position == "butler") {
            
          connection.execute(
            `INSERT INTO butler_staff (employee_id, hotel_id, room_number) VALUES ('${newEmployee.employee_id}', '${newEmployee.hotel_id}', NULL)`,
            
            (err, res) => {

              if (err) {
                console.log("or here");
                console.log("error: ", err);
                result(err, null);
                return;
              }

              result(null, {
                id: res.insertId,
                ...newEmployee,
              });
            }
          );
        } else if (newEmployee.position == "housekeeping") {
          connection.execute(
            `INSERT INTO housekeeping_staff (employee_id, level) VALUES (?, "trainee")`,
            [newEmployee.employee_id],
            (err, res) => {
              if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
              }

              result(null, {
                id: res.insertId,
                ...newEmployee,
              });
            }
          );
        }
        else {
          result(null, {
            id: res.insertId,
            ...newEmployee,
          });
        }
        connection.execute("commit");


      }
    );
  }
  );

};

Employee.findById = (employee_id, result) => {
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
      `SELECT e.employee_id, e.dob, e.name, e.position, e.hotel_id, h.hotel_name FROM employee e JOIN hotel h ON e.hotel_id = h.hotel_id WHERE employee_id = '${employee_id}'`,
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

Employee.findButlerByRoomNumber = (room_number, hotel_id, result) => {
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
      `SELECT e.employee_id, e.dob, e.name, e.position, e.hotel_id FROM employee e JOIN butler_staff bs ON e.employee_id = bs.employee_id WHERE bs.hotel_id = '${hotel_id}' AND bs.room_number = '${room_number}'`,
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
            no_hotel_name_keys.map((key, i) => {
                obj[key] = hotel[i]

            })
            temp_result.push(obj)
        })
        
        
        result(null, temp_result);
      }
    );
  });

};

Employee.findHousekeepingByRoomNumber = (room_number, hotel_id, result) => {
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
      `SELECT e.employee_id, e.dob, e.name, e.position, e.hotel_id FROM employee e JOIN room_cleaning rc ON e.employee_id = rc.employee_id WHERE rc.hotel_id = '${hotel_id}' AND rc.room_number = '${room_number}'`,
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
            no_hotel_name_keys.map((key, i) => {
                obj[key] = hotel[i]

            })
            temp_result.push(obj)
        })
        
        
        result(null, temp_result);
      }
    );
  });
  

};

Employee.findByHotelId = (hotelId, result) => {
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
      `SELECT * FROM employee WHERE hotel_id = '${hotelId}'`,
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
            no_hotel_name_keys.map((key, i) => {
                obj[key] = hotel[i]

            })
            temp_result.push(obj)
        })
        
        
        result(null, temp_result);
      }
    );
  });
};

Employee.getAdminEmployee = (employee_id, result) => {
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
      `SELECT e.employee_id, e.name, e.dob, a.email 
      FROM Employee e
      JOIN Admin_Staff a ON e.employee_id = a.employee_id
      WHERE e.employee_id = (
        SELECT employee_id 
        FROM Admin_Staff 
        WHERE employee_id = ''${employee_id}''
      )`,
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

Employee.getButlerEmployee = (employee_id, result) => {
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
      `SELECT * FROM butler_staff WHERE employee_id = '${employee_id}'`,
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
            butler_staff_keys.map((key, i) => {
                obj[key] = hotel[i]

            })
            temp_result.push(obj)
        })
        
        
        result(null, temp_result);
      }
    );
  });
  

};

Employee.getHousekeepingEmployee = (employee_id, result) => {
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
      `SELECT * FROM housekeeping_staff WHERE employee_id = '${employee_id}'`,
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
            house_keeping_staff_keys.map((key, i) => {
                obj[key] = hotel[i]

            })
            temp_result.push(obj)
        })
        
        
        result(null, temp_result);
      }
    );
  });
  
 
};

Employee.findByPosition = (position, result) => {
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
      `SELECT * FROM employee WHERE position = '${position}`,
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
            no_hotel_name_keys.map((key, i) => {
                obj[key] = hotel[i]

            })
            temp_result.push(obj)
        })
        
        
        result(null, temp_result);
      }
    );
  });
};

Employee.findByDOB = (dob, result) => {
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
      `SELECT * FROM employee WHERE dob = '${dob}'`,
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
            no_hotel_name_keys.map((key, i) => {
                obj[key] = hotel[i]

            })
            temp_result.push(obj)
        })
        
        
        result(null, temp_result);
      }
    );
  });
};

Employee.findByName = (name, result) => {
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
      `SELECT * FROM employee WHERE name like "%${name}'`,
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
            no_hotel_name_keys.map((key, i) => {
                obj[key] = hotel[i]

            })
            temp_result.push(obj)
        })
        
        
        result(null, temp_result);
      }
    );
  });
};

Employee.getAll = (result) => {
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
      `SELECT * FROM employee`,
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
            no_hotel_name_keys.map((key, i) => {
                obj[key] = hotel[i]

            })
            temp_result.push(obj)
        })
        
        
        result(null, temp_result);
      }
    );
  });
};

Employee.login = (email, password, result) => {


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
      `SELECT e.employee_id, e.name, e.dob, a.password, e.hotel_id
FROM Employee e
JOIN Admin_Staff a ON e.employee_id = a.employee_id
WHERE e.employee_id = (
  SELECT employee_id
  FROM Admin_Staff
  WHERE email = '${email}'
)`,
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }

        if (res.rows.length) {
          const admin = res.rows[0];
    
          const isPasswordValid = bcrypt.compareSync(password, admin[3]);

          if (!isPasswordValid) {
            console.error("error: ", err);
            result({ kind: "password_incorrect" }, null);
            return;
          }

          const token = jwt.sign(
            {
              employee_id: admin[0],
              name: admin[1],
              email: email,
              dob: admin[2],
              hotel_id: admin[4],
            },
            'hotelmngr',
            {
              expiresIn: "1h",
            }
          );

          console.log("logged in guest: ", admin);
          result(null, token);
        } else {
          console.error("error: ", err);
          result({ kind: "user_not_found" }, null);
        }
      }
    );
  });


};

Employee.getByEmail = (email, result) => {


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
     `SELECT e.employee_id, e.name, e.dob, a.email 
     FROM Employee e
     JOIN Admin_Staff a ON e.employee_id = a.employee_id
     WHERE e.employee_id = (
       SELECT employee_id 
       FROM Admin_Staff 
       WHERE email = '${email}'
     )`
      ,
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

Employee.updatePassword = (token, password, result) => {
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

    connection.execute(`UPDATE admin_staff SET password = '${password}' WHERE (SELECT employee_id FROM admin_password_token WHERE token = '${token}')`,
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }

        connection.execute(`DELETE FROM admin_password_token WHERE token = '${token}'`,
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
      }
    );
  });
};

Employee.updateEmployee = (id, employee, result) => {
  //`UPDATE employee SET dob = ?, name = ?, position = ?, hotel_id = ? WHERE employee_id = '${id}'`
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

    connection.execute(`UPDATE employee SET dob = '${employee.dob}', name = '${employee.name}', position = '${employee.position}', hotel_id = '${employee.hotel_id}' WHERE employee_id = '${id}'`,
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

Employee.updateAdminEmployee = (id, employee, result) => {


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

    connection.execute(`UPDATE employee SET dob = '${employee.dob}', name = '${employee.name}', position = '${employee.position}' WHERE employee_id = '${id}'`,
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }

        connection.execute(`UPDATE admin_staff SET email = '${employee.email}' WHERE employee_id = '${id}'`,
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
      }
    );
  });
};

Employee.deleteById = (employee_id, result) => {
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

    connection.execute(`DELETE FROM employee WHERE employee_id = '${employee_id}'`,
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

Employee.deleteAll = (result) => {
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

    connection.execute(`DELETE FROM employee`,
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
  }
  );
};

Employee.assignButler = (butler, room, result) => {
  // check if a room with the same amenity_id already exists and if yes, do not add it again

  // add the hotel_id and room_number to the butler_staff table

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

    connection.execute(`UPDATE butler_staff SET room_number = ${room} WHERE employee_id = '${butler}'`,
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
  }
  );
};

Employee.assignHousekeepingToRoom = (rooms, result) => {
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

    connection.execute(`INSERT INTO room_cleaning (hotel_id, room_number, employee_id) VALUES '${rooms.hotel_id}', '${rooms.room_number}', '${rooms.employee_id}'`,
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
  }
  );
};

Employee.unassignButler = (rooms, result) => {
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

    connection.execute(`UPDATE  butler_staff SET hotel_id = NULL, room_number = NULL WHERE employee_id = '${rooms.employee_id}'`,
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
  }
  );

};

Employee.unassignHousekeepingToRoom = (rooms, result) => {
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

    connection.execute(`DELETE FROM room_cleaning WHERE hotel_id = '${rooms[0][0]}' AND room_number = '${rooms[0][1]}' AND employee_id = '${rooms[0][2]}'`,
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
  }
  );
};

module.exports = Employee;
