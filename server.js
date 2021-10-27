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
const bodyParser = require("body-parser");
var express = require("express");
var app = express();


// Establishing Handlebars
const exphbs = require("express-handlebars");
app.engine('.hbs', exphbs({
  extname: '.hbs',
  defaultLayout: "index"
}));
app.set('view engine', '.hbs');

//
app.use(bodyParser.urlencoded({extended: false}));

//To import exterior functions
const kitsModel = require("./models/node");


//Checking broken page
app.use(function(err,req,res,next){
console.error(err.stack)
res.status(500).send("<h1> Something Broke!<h1>")
});


//Using Static folder
app.use(express.static("static"));


// Navigations 
app.get("/", function(req,res){
 res.render("navigations/home",{
    kits : kitsModel.getTopMeals()
 });
});
app.get("/signup", function(req,res){
  res.render("navigations/signup");
 });

 app.get("/login", function(req,res){
  res.render("navigations/login");
 });

 app.post("/login", function(req,res){
   const {emailaddress, password} = req.body;
   let validation = {};
   let passEmail,passPass = true;
   if(typeof emailaddress == 'string' && emailaddress.length !=0){
    passEmail= true;
     validation.emailaddress = null;
   }
   else{
     validation.emailaddress ="Please enter a valid email address";
     passEmail= false;
   }
   if(typeof password == 'string' && password.length !=0){
    passPass= true;
    validation.password = null;
  }
  else{
    validation.password = "Please enter a valid password";
    passPass= false;
  }


   if(passPass && passEmail){
    res.render("navigations/welcome",{});
    validation = {};
  }
  else{
    res.render("navigations/login",{
      validation,
      value : req.body
    });
  };
});

 app.get("/onthemenu", function(req,res){
  res.render("navigations/onthemenu",{
    kits : kitsModel.getCategoryKits()
  });
 });


// Port Listening
var HTTP_PORT = process.env.PORT || 8080;
// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}
// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT, onHttpStart);