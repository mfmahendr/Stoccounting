const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

const userRoutes = require('./route/user');
const beliRoutes = require('./route/pembelian');
const jualRoutes = require('./route/penjualan');
const pelaporanRoutes = require('./route/pelaporan');
const authRoutes = require('./route/auth');

dotenv.config( { path : 'config.env'} )

// server
const app = express();

const corsConfig = {
  credentials: true,
  origin: process.env.ORIGIN_FE,
};

app.use(cors(corsConfig));

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended : true}));
// app.use('/', express.static('public'));

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.SERVER_PORT || '3000';

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', process.env.ORIGIN_FE);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  });

app
  .use("/api/user", userRoutes)
  // .use("/user", authRoutes)
  .use("/api/penjualan", jualRoutes)
  .use("/api/pembelian", beliRoutes)
  .use("/api", pelaporanRoutes)
  .get("/", (req, res) => res.send("Welcome to the API!"))
  .all("*", (req, res) => res.send("You've tried reaching a route that doesn't exist."))

// connect to DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(console.log("Connected to Database"))
  .catch((err) => console.error(err));

//Server / URL
app.listen(PORT, () =>
  console.log(`Server running on port: http://${HOST}:${PORT}`)
)