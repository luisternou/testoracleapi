// create a new express server
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config("./config/config.env");


app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

const port = process.env.PORT || 8000;

app.use(express.json());

app.get("/", (req, res) => {
  res.redirect("/apidocs");
});



app.use("/api/v1/hotel", require("./routes/hotel.route"));
app.use("/api/v1/room", require("./routes/room.route"));
app.use("/api/v1/employee", require("./routes/employee.route"));
app.use("/api/v1/amenity", require("./routes/amenity.route"));
app.use("/api/v1/guest", require("./routes/guest.route"));
app.use("/api/v1/booking", require("./routes/booking.route"));
app.use("/api/v1/payment", require("./routes/payment.route"));

app.listen(port, () => console.log(`Server running on port ${port}`));
