const express = require('express');
const router = express.Router();
const kitsModel =  require("../models/node");
const cartInfo = require("../controllers/meal-detail");
//dashboard
router.get("/customer", function(req,res){
    if(req.session.customeruser)
    {
     res.render("user/customer",{
        count: cartInfo.mealId.length
     });
    }
    else
     res.redirect("/login");
  });
router.get("/clerk", function(req,res){
    if(req.session.clerkuser)
     res.render("user/clerk",{
        kits : kitsModel.allKits,
     });
    else
     res.redirect("/login");
});


//logout
router.get("/logout", (req, res) => {
    // Clear the session from memory.
    req.session.destroy();
    res.redirect("/login");
});

 //Exporting router
 module.exports = router;