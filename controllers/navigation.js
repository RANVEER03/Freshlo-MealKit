const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs")
const session = require("express-session")
//To import exterior functions
const kitsModel = require("../models/node");

// To import user schema
const userModel = require("../models/user");

// Establishing Send-grid mail
const sgmail = require("@sendgrid/mail");

//All navigation
//Home
router.get("/", function(req,res){
    res.render("navigations/home",{
       kits : kitsModel.getTopMeals()
    });
});
//Menu
router.get("/onthemenu", function(req,res){
    res.render("navigations/onthemenu",{
      kits : kitsModel.getCategoryKits()
    });
});
//Signup
router.get("/signup",function(req,res){
   res.render("navigations/signup");
});

//dashboard
router.get("/dashboard/customer", function(req,res){
  if(req.session.user)
   res.render("user/customer");
  else
   res.redirect("/login");
});

router.post("/signup", function(req,res){
    const {firstname, lastname, emailaddress, password} = req.body;
    let validation = {};
    let passed = true;
    //regex
    const validEmail = /[A-Za-z0-9._]{3,}@[A-Za-z]{3,}[.][A-Za-z.]{2,6}/;
    const validPassNum = /(?=.*[0-9])/ ;
    const validPassSmall = /(?=.*[a-z])/;
    const validPassLarge =  /(?=.*[A-Z])/;
    const validPassSpecial = /(?=.*[@!#$%^&-+=()])/;
    const validPassLength = /(?=.{8,})/;

    if(!validEmail.test(emailaddress)){
      validation.emailaddress= "Please enter correct domain (@example.extension)";
      passed = false;
    };
    if(firstname.trim().length == 0){
       validation.firstname ="Please enter valid firstname";
       passed = false;   
    };
    if(lastname.trim().length==0){
      validation.lastname ="Please enter valid lastname";
      passed = false;  
    };
    if(emailaddress.trim().length==0){
      validation.emailaddress ="Please enter valid emailaddress";

      passed = false;   
    };
    //Checking for the same user
    // let sameUser = userModel.findOne({emailaddress});
    // if(sameUser){
    //   validation.emailaddress= "This email address already exists, Please try different";
    //   passed= false;
    // }
    //
    if(password.length==0){
      validation.password=[];
      validation.password.push("Please enter valid password");
      passed = false;
    }
    else{
      validation.password = [];
      validation.password.string = "You are missing";
      if(!validPassNum.test(password)){
        validation.password.push(" a Number");
        passed=false;
      };
      if(!validPassSmall.test(password)){
        validation.password.push(" a small character");
        passed=false;
      };
      if(!validPassLarge.test(password)){
        validation.password.push(" a large character");
        passed=false;
      };
      if(!validPassSpecial.test(password)){
        validation.password.push(" a special character");
        passed=false;
      };
      if(!validPassLength.test(password)){
        validation.password.push(" 8 characters");
        passed=false;
      };
    };
    
    if(passed){
      validation = {};
      sgmail.setApiKey(process.env.mailKey);
      const mailMsg = {
        To : `${emailaddress}`,
        From : 'rssaini8@myseneca.ca',
        Subject : 'Welcome (freshlo) You are registered!',
        html : `Your Full Name : ${firstname} ${lastname} <br>
                Your Email Address: ${emailaddress} <br>
                Your password: ${password}<br>
                Url: https://freshlo-web322.herokuapp.com/<br><br><br><br>
                freshlo -by<br>
                <i>Ranveer Singh Saini<i>`
      }; 
      const userDB = new userModel({
          firstname: firstname,
          lastname: lastname,
          emailaddress: emailaddress,
          password: password
      });
      userDB.save()
      .then((savedUser) => {
          // User was saved correctly.
          console.log(`User ${savedUser.firstname} has been added to the database.`);
          sgmail.send(mailMsg).then(()=>{
            res.render("navigations/welcome",{
              value: req.body,
              msg: "Mail sent successfully"
            });
          }).catch(err =>{
            res.render("navigations/signup",{
              validation,
              value: req.body
            });
          });
      })
      .catch((err) => {
          console.log(`Error adding user to the database ... ${err}`);
      });
    }
    else{
      res.render("navigations/signup",{
        validation,
        value: req.body
      });
    }
  });
//Login
  router.get("/login", function(req,res){
    res.render("navigations/login");
   });

   router.post("/login", function(req,res){
    const {emailaddress, password} = req.body;
    let validation = {};
    let passEmail,passPass = true;
    if(typeof emailaddress == 'string' && emailaddress.trim().length !=0){
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
     validation = {};
     userModel.findOne({
      emailaddress: emailaddress  
     })
     .then(user => {
      // Completed the search.
      if (user) {
          // Found the user document.
          // Compare the password entered in the form with the one in the user document.
          bcrypt.compare(password, user.password)
          .then(isMatched => {
              // Done comparing the passwords.
  
              if (isMatched) {
                  // Passwords match.
                  // Create a new session and store the user document (object)
                  // to the session.
                  req.session.user = user;
                  res.redirect("/dashboard/customer");
              }
              else {
                  // Passwords to not match.
                  console.log("Passwords do not match.");
                  validation.password = "Sorry, your password does not match our database.";  
                  res.render("navigations/login",{
                    validation,
                    value: req.body
                  });
              }
          })
          .catch(err => {
              // Couldn't compare passwords.
              console.log(`Unable to compare passwords ... ${err}`);
              errors.push("Oops, something went wrong.");
              res.render("navigations/login",{
                validation,
                value: req.body
              });
          });
      }
      else {
          // User was not found in the database.
          console.log("User not found in the database.");
          validation.emailaddress = "Email not found in the database.";
          res.render("navigations/login",{
            validation,
            value: req.body
          });
      }
  })
  .catch(err => {
      // Couldn't query the database.
      console.log(`Error finding the user in the database ... ${err}`);
      errors.push("Oops, something went wrong.");
      res.render("navigations/login",{
        validation,
        value: req.body
      });
  });
   }
   else{
     res.render("navigations/login",{
       validation,
       value: req.body
     });
   };
});

router.get("/logout", (req, res) => {
  // Clear the session from memory.
  req.session.destroy();
  res.redirect("/login");
});

 //Exporting router
module.exports = router;