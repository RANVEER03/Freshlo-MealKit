const express = require('express');
const router = express.Router();
const nodeModel = require("../models/node");
const sgmail =  require("@sendgrid/mail");
const req = require('express/lib/request');
var mealId = [];
let value = [];
var total;

router.get("/detail/:kitId", function(req,res){
    let value = {};
    const id= req.params.kitId;
    nodeModel.mealModel.findOne({_id:id})
    .then((matchedMeal)=>{
        value= matchedMeal.toObject();
          res.render("data/details",{
              value,
          })
    })
    .catch(err=>{
        console.log(err)
    });

});

router.post("/detail/:kitId", function(req,res){
    if(req.session.customeruser){
    mealId.push(req.params.kitId);
    nodeModel.mealModel.findOne({_id: req.params.kitId})
    .then((matchedMeal)=>{
        let value= matchedMeal.toObject();
        res.render("navigations/onthemenu",{
            msg: `Added ${value.Title} to your cart`,
            kits : nodeModel.getCategoryKits()
        });
    })
    .catch(err=>{
        console.log(err)
    });
    }
    else{
        res.redirect("/dashboard/customer");
    }
});

router.get("/cart", function(req,res){
    var index=1;
    value=[];
    var kit={};
    var msg;
    var toTotal;
    total = 0;
    if(req.session.customeruser){    
    mealId.forEach(id => {
     nodeModel.mealModel.findOne({_id:id})
    .then((matchedMeal)=>{
        var found = value.find(temp=>temp.id == id);
        if(!found){
            kit={
                id: id,
                used: false,
                 title : matchedMeal.Title,
                 description : matchedMeal.Description,
                 url :  matchedMeal.ImageURL,
                 price : matchedMeal.Price,
                 quantity : 1,
            };
            value.push(kit);
        }
        else{
           for(i=0;i<value.length;i++){
               if(value[i].id == id){
                   value[i].quantity++;
               };
           }
        };
       toTotal = matchedMeal.Price;
        toTotal = toTotal.substring(1);
        toTotal = parseFloat(toTotal);
        total =  total + toTotal;
        if(index==mealId.length){
            res.render("data/cart",{
                mealKit: value,  
                total,
                msg
            });
        }
        else index++;     
    })
    .catch(err=>{
        console.log(err)
    });
    });
      if(mealId.length==0){
        msg="No kits found in your cart";
        res.render("data/cart",{
            msg
        });
       }
    }
    else{
        res.redirect("/");
    };
});

router.post("/cart", function(req,res){
     
     let kitDetails = [];
     for(i=0;i<value.length;i++){
         kitDetails.push(`<li>${value[i].title} X ${value[i].quantity}`)
     }  
     kitDetails.join('</li>');
     sgmail.setApiKey(process.env.mailKey);
     const mailMsg = {
      To : `${req.session.customeruser.emailAddress}`,
      From : 'rssaini8@myseneca.ca',
      Subject : 'Checkout Review(freshlo)',
      html : `<p>Order Details:  </p> <ol>${kitDetails}</ol><hr> <p>Total: $${total}</p> <p>Thank you for your order,<br>We will deliver it soon :)</p>`
    };
    sgmail.send(mailMsg).then(()=>{
        res.render("data/cart",{     
            msg: "Your order was placed successfully, please check your email for details"
         })
        console.log("An order was made successfully");
         //Empty cart
         mealId = [];
         value = [];
         total = 0;

      }).catch(err =>{
        res.render("data/cart",{     
            msg: "Something went wrong"
         })
      });
});

router.get("/logout",(req,res)=>{
    mealId = [];
    value = [];
    total = 0;
    req.session.destroy();
    res.redirect("/login");
});

//Exporting selected mealKits for cart
module.exports.mealId = mealId;
 //Exporting router
 module.exports.router = router;

