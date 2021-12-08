const express = require('express');
const router = express.Router();
const session=require("express-session");
const nodeModel = require("../models/node")
const path = require("path")

router.get("/meal-kits", function(req,res){
   let msg = "";
   if(req.session.clerkuser)
    msg = "Please add your Data"
   else
   msg = "You are not authorized to add-data"
   res.render("data/load-data",{
     msg,
     add : true
    }); 
});

router.post("/meal-kits", function(req,res){
    let msg = "";
    let validation={};
    let passed = true;
    let topMeal;
    let category= [];
    var mealPic="";
    
    if(!(classic || featured || newcategory != 0)){
        
        passed =  false;
        validation.category = "Please select at least one from above"
    };
    if(title==0 || description==0 || cookingtime==0 || calories==0 || price==0){
       validation.error = "Please enter valid details"
       passed  =  false;
    };
    if(!(truetopmeal||falsetopmeal)){
      validation.topmeal="Please select at least one";
      passed= false;
    }
    else if(truetopmeal && falsetopmeal){
      validation.topmeal="Select only one";
      passed= false;
    };
    if(req.files){
      let extension = path.parse(req.files.mealPicture.name).ext;
      if(extension != '.jpg' && extension != '.jpeg' && extension != '.png' && extension != '.gif'){
         validation.mealPicture="Please use .jpg, .jpeg, .png and .gif extensions which support pictures"
         passed=false;
        }
     }

    if(passed){
      if(truetopmeal){
        topMeal = true;
      }
      else topMeal = false;

      if(classic){
        category.push("Classic Meals");
      }
      else if (featured){
         category.push("Featured Meals");
      }
      else {
        category.push(newcategory);
      };

      category.forEach(categoryName => {
      const newKit = new nodeModel.mealModel({
        Title : title,
        ingredients : "",
        Description : description,
        Category : categoryName,
        Price : price,
        CookingTime : cookingtime,
        Calories : calories,
        TopMeal :  topMeal
      });
      newKit.save()
      .then((savedKit)=>{
         console.log(`Kit has been added successfully in ${savedKit.Category}`)
         mealPic = `meal-pic-${savedKit._id}${path.parse(req.files.mealPicture.name).ext}`;
        // Copy the image data to a file
        req.files.mealPicture.mv(`static/pics/${mealPic}`)
        .then(() => {
            // Update the user document so that the name of the image is stored in the document.
            nodeModel.mealModel.updateOne({
                _id: savedKit._id
            }, {
              ImageURL: `/pics/${mealPic}`
            })
            .then(() => {
                console.log("Meal document was updated with the picture.");
                //Refreshing Database;
                nodeModel.refresh();
            })
            .catch(err => {
                console.log(`${err}`);
                
            });
        });
         msg = "Added Kit successfully in database"
         res.render("data/load-data",{
          msg,
          add: true
        }); 
      })
      .catch(err=>{
        console.log(`${err}`);
      });
     });
    }
    else{
      msg="Failed to add data to database"
     res.render("data/load-data",{
       msg,
       validation,
       value : req.body,
       add: true
     }); 
    }
 });


 router.get("/meal-kits/:kitId", function(req,res){
  let id = req.params.kitId;
  nodeModel.mealModel.findOne({_id : id})
  .exec()
  .then(kitToUpdate=>{
    let value = {}
    if(kitToUpdate.Category == "Classic Meals"){
      value.classic = true;
    }
    if(kitToUpdate.Category == "Featured Meals"){
       value.featured = true;
    }
    if(kitToUpdate.Category != "Featured Meals" && kitToUpdate.Category != "Classic Meals"){
      value.newcategory = kitToUpdate.Category;
    }
    value.id= kitToUpdate._id;
    value.title = kitToUpdate.Title;
    value.description = kitToUpdate.Description;
    value.cookingtime = kitToUpdate.CookingTime;
    value.calories = kitToUpdate.Calories;
    value.price = kitToUpdate.Price;
    value.pic= kitToUpdate.ImageURL;
    if(kitToUpdate.TopMeal){
      value.truetopmeal =  true;
    }
    else{
      value.falsetopmeal =  true;
    }
    let msg = "";
    if(req.session.clerkuser)
     msg = "Please update your Data"
    else
    msg = "You are not authorized to update-data"
    res.render("data/load-data",{
      msg,
      value,
      update: true
     });
  })
  .catch(err=>{
     console.log(err);
  });  
});

router.post("/meal-kits/:kitId", function(req,res){
  const id = req.params.kitId;
  let topMeal;
  let category= [];
  let validation = {};
  let msg;
  let mealPic;
  const {classic, featured, newcategory, title, description, cookingtime, calories, price, truetopmeal, falsetopmeal} = req.body;
  
    if(truetopmeal){
      topMeal = true;
    }
    else if(falsetopmeal){
      topMeal = false;
    }
  if(classic){
    category="Classic Meals";
  }
  else if (featured){
     category="Featured Meals";
  }
  else {
    category=newcategory;
  };
   
  nodeModel.mealModel.findOne({_id : id})
  .exec()
  .then(kitToCheck=>{
    let value = {};
    if(kitToCheck.Category == "Classic Meals"){
      value.classic = true;
    }
    if(kitToCheck.Category == "Featured Meals"){
       value.featured = true;
    }
    if(kitToCheck.Category != "Featured Meals" && kitToCheck.Category != "Classic Meals"){
      value.newcategory = kitToCheck.Category;
    }
    value.id= kitToCheck._id;
    value.title = kitToCheck.Title;
    value.description = kitToCheck.Description;
    value.cookingtime = kitToCheck.CookingTime;
    value.calories = kitToCheck.Calories;
    value.price = kitToCheck.Price;
    value.pic = kitToCheck.ImageURL;
    mealPic = kitToCheck.ImageURL;
    if(kitToCheck.TopMeal){
      value.truetopmeal =  true;
    }
    else{
      value.falsetopmeal =  true;
    }
    if( title== kitToCheck.Title && description == kitToCheck.Description && category == kitToCheck.Category && price == kitToCheck.Price && cookingtime == kitToCheck.CookingTime && calories == kitToCheck.Calories && topMeal == kitToCheck.TopMeal && !(req.files)){
          console.log("No changes were made to update meal kit");

          validation.mealPicture = "Nothing was changed so cant be updated";
          msg = "Everything is Up-to-date";

          res.render("data/load-data",{
            msg,    
            validation,
            value,
            update: true
           });
        }
        else if(title==0 && description==0  && category==0  && price==0 && cookingtime ==0 && calories == 0 && !topMeal){
          nodeModel.mealModel.deleteOne({_id: id})
          .exec()
          .then(()=>{
            console.log(`Deleted document with title ${kitToCheck.Title}`);
            nodeModel.refresh();
            res.redirect("/dashboard/clerk");
          })
          .catch(err=>{
            console.log(err);
          })
        }
        else{
          if (truetopmeal && falsetopmeal){
            validation.topmeal = "Please select at least one";
            res.render("data/load-data",{
              msg,    
              validation,
              value,
              update: true
             });
          }
          if(req.files){
         mealPic = `/pics/meal-pic-${kitToCheck._id}${path.parse(req.files.mealPicture.name).ext}`;
        // Copy the image data to a file
        req.files.mealPicture.mv(`static/${mealPic}`)
        .then(()=>{
          console.log("Updating new meal picture")
        });
      };
        nodeModel.mealModel.updateOne({
            _id: id
        }, {
          $set: {
          Title : title,
          ingredients : "",
          Description : description,
          Category : category,
          Price : price,
          CookingTime : cookingtime,
          Calories : calories,
          TopMeal :  topMeal,
          ImageURL : mealPic
          }
        })
        .then(() => {
          console.log("Meal document was updated successfully.");
          msg="Updated successfully";
          nodeModel.refresh();
          res.redirect(`/load-data/meal-kits/${id}`)
         })
         .catch(err => {
          console.log(`${err}`); 
         });
        };
      })
      .catch(err=>{
        console.log(err);
      });     
});
 
 //Exporting router
 module.exports = router;