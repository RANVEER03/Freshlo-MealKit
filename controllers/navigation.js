const express = require('express');
const router = express.Router();

//To import exterior functions
const kitsModel = require("../models/node");

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
     res.render("navigations/welcome");
     validation = {};
   }
   else{
     res.render("navigations/login",{
       validation,
       value: req.body
     });
   };
 });

 //Exporting router
module.exports = router;