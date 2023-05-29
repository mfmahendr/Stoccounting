const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user');
const beliRoutes = require('./routes/pembelian');
const jualRoutes = require('./routes/penjualan');
const authRoutes = require('./routes/auth');

const app = express();

app.set('view engine', 'ejs')

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || '3000';


app.use(bodyparser.urlencoded({ extended : true}));
app.use('/', require('./routes/'));

mongoose.connect("mongodb://localhost:27017/");

app.get("/", function(req, res) {
    res.render('./services/')
});

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', process.env.origin_fe);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  });

app
  .use("/user", userRoutes)
  .use("/user", authRoutes)
  .use("/penjualan", jualRoutes)
  .use("/pembelian", beliRoutes)
  .get("/", (req, res) => res.send("Welcome to the API!"))
  .all("*", (req, res) => res.send("You've tried reaching a route that doesn't exist."))

//dB
mongoose
  .connect(process.env.dB_connection) 
  .then(console.log("Connected to database"))
  .catch((error) => console.error(error))

//Server / URL
app.listen(process.env.PORT, () => 
  console.log(`Server running on port: http://${HOST}:${PORT}`)
)