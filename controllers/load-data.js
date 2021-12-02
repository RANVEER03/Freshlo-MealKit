const express = require('express');
const router = express.Router();
const session=require("express-session");
const mealModel = require("../models/node")
router.get("/meal-kits", function(req,res){
   let msg = "";
   if(req.session.clerkuser)
    msg = "Please add your Data"
   else
   msg = "You are not authorized to add-data"
   res.render("data/load-data",{
     msg,
    }); 
});

router.post("/meal-kits", function(req,res){
    let msg = "";
    let validation={};
    let passed = true;
    const {classic, featured, newcategory, title, description, cookingtime, calories, price, truetopmeal, falsetopmeal} = req.body
    // if(req.session.clerkuser)
    //  msg = "Please add your Data"
    // else
    // msg = "You are not authorized to add-data"
    
    res.render("data/load-data",{
      msg,
      validation
     }); 
 });

 //Exporting router
 module.exports = router;