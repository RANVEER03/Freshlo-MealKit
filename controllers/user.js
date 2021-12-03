const express = require('express');
const router = express.Router();
const kitsModel =  require("../models/node");

//dashboard
router.get("/customer", function(req,res){
    if(req.session.customeruser)
     res.render("user/customer");
    else
     res.redirect("/logout");
  });
router.get("/clerk", function(req,res){
    if(req.session.clerkuser)
     res.render("user/clerk",{
        kits : kitsModel.allKits,
     });
    else
     res.redirect("/logout");
});

router.get("/dashboard", function(req,res){
    if(req.session.clerkuser)
    res.redirect("/clerk");
    else
    res.redirect("/customer");  
});

//logout
router.get("/logout", (req, res) => {
    // Clear the session from memory.
    req.session.destroy();
    res.redirect("/login");
});

 //Exporting router
 module.exports = router;