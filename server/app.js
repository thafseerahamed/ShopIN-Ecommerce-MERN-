const express = require("express");
const app = express();

const cookieParser = require("cookie-parser");
const bodyparser = require("body-parser");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");

const errorMiddleware = require("./middlewares/errors");
dotenv.config({ path: "server/config/config.env" });
app.use(express.json());
app.use(cookieParser());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(fileUpload());





//Import all routes
const products = require("./routes/product");
const user = require("./routes/user");
const order = require("./routes/order");
const payment = require("./routes/payment");

app.use("/api/v1", products);
app.use("/api/v1", user);
app.use("/api/v1",order)
app.use("/api/v1",payment)

// middleware to handle errors
app.use(errorMiddleware);

module.exports = app;
