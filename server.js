/************************************************************************************
* WEB322 – Project (Fall 2021)
* I declare that this assignment is my own work in accordance with Seneca Academic
* Policy. No part of this assignment has been copied manually or electronically from
* any other source (including web sites) or distributed to other students.
*
* Name: Ranveer Singh Saini
* Student ID: 134213206
* Course/Section: WEB322 ZAA
*
************************************************************************************/

//Establishing express
var express = require("express");
var app = express();

//Establishing Dotenv
const dotenv = require("dotenv");
dotenv.config({path: "./keys/myKeys.env"});

// Establishing Handlebars
const exphbs = require("express-handlebars");
app.engine('.hbs', exphbs({
  extname: '.hbs',
  defaultLayout: "index"
}));
app.set('view engine', '.hbs');

//Establishing express-sessions
const session = require("express-session");
app.use(session({
  secret: process.env.SECRET_STRING,
  resave: false,
  saveUninitialized: true
}));
app.use((req, res, next) => {
  // res.locals.user is a global handlebars variable.
  // This means that every single handlebars file can access this variable.
  res.locals.user = req.session.user;
  next();
});

// Establishing body parser
app.use(express.urlencoded({extended: false}));

// Establishing mongoose
const mongoose = require('mongoose');
mongoose.connect(process.env.CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("Connected to the MongoDB database.");
})
.catch((err) => {
  console.log(`Cannot connect because of the error....${err}`);
});

//Using Static folder
app.use(express.static("static"));

//configuring my controllers
const navigation = require("./controllers/navigation");

// All Navigation
 app.use("/",navigation);
 app.use("/onthemenu",navigation);
 app.use("/signup",navigation);
 app.use("/login",navigation);
 app.use("/dashboard/customer",navigation);
 app.use("/logout",navigation);

// Port Listening
var HTTP_PORT = process.env.PORT || 8080;

// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT, onHttpStart);