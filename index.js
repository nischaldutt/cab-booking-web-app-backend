/*********************************
 * CAB BOOKING MANAGEMENT SYSTEM
 * created by Nischal Dutt
 * on 21/02/2019
 *********************************/

const express = require("express");
const bodyParser = require("body-parser");
const swaggerUI = require("swagger-ui-express");

const db = require("./database/mongodb");
const CONSTANTS = require("./properties/constants");
const customerRouter = require("./routes/customerRoutes");
const driverRouter = require("./routes/driverRoutes");
const adminRouter = require("./routes/adminRoutes");
const swaggerDocument = require("./swagger.json");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

//ADMIN ROUTES
app.use("/admin", adminRouter);

//CUSTOMER ROUTES
app.use("/customer", customerRouter);

//DRIVER ROUTES
app.use("/driver", driverRouter);

db.connect((err) => {
  if (err) {
    console.log("unable to connect to mongo database");
    process.exit(1);
  } else {
    app.listen(process.env.PORT || 3000, () => {
      console.log("server online !");
    });
  }
});
