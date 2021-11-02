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

// Establishing Handlebars
const exphbs = require("express-handlebars");
app.engine('.hbs', exphbs({
  extname: '.hbs',
  defaultLayout: "index"
}));
app.set('view engine', '.hbs');

//Establishing Dotenv
const dotenv = require("dotenv");
dotenv.config({path: "./keys/myKeys.env"});

// Establishing body parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: false}));

//Using Static folder
app.use(express.static("static"));

//configuring my controllers
const navigation = require("./controllers/navigation");

// All Navigation
 app.use("/",navigation);
 app.use("/onthemenu",navigation);
 app.use("/signup",navigation);
 app.use("/login",navigation);

// Port Listening
var HTTP_PORT = process.env.PORT || 8080;

// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT, onHttpStart);