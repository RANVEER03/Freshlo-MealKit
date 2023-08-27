
// Establishing mongoose
const mongoose = require("mongoose");
const schema = mongoose.Schema;

const mealSchema = new schema({
    Title : {
        type: String,
        required: true
    },
    ingredients : {
        type: String
    },
    Description : {
        type: String,
        required: true
    },
    Category : {
        type: String,
        required: true
    },
    Price : {
        type: String,
        required: true
    },
    CookingTime : {
        type: String,
        required: true
    },
    Calories : {
        type: String,
        required: true
    },
    ImageURL : {
        type: String,
    },
    TopMeal : {
        type: Boolean,
        required: true
    }
});

const mealModel = mongoose.model("mealKits", mealSchema);
module.exports.mealModel = mealModel;

// var allKits = [
// {   
//         Title : "Chicken Caesar Salad",
//         ingredients : "Romania, caesar, bacon, lime wedge, croutons",
//         Description : "with bacon, croutons shredded and extra dressing on side",
//         Category : "Classic Meals",
//         Price : "$14.99",
//         CookingTime : "25 minutes",
//         Calories : "890",
//         ImageURL : "/pics/topItem2.jpg",
//         TopMeal :  true
// },
// {
//         Title : "Korean Tofu",
//         ingredients : "",
//         Description : "with tofu, citrus dressing tossed in broccoli and carrots",
//         Category : "Classic Meals",
//         Price : "$15.50",
//         CookingTime : "10 minutes",
//         Calories : "1102",
//         ImageURL : "/pics/tofuriceclassic.jpeg",
//         TopMeal :  false
// },
// {
//         Title : "Steak House",
//         ingredients : "",
//         Description : "with medium well steak that can be cooked further and bomb tomatoes as salad",
//         Category : "Classic Meals",
//         Price : "$23.14",
//         CookingTime : "20 minutes",
//         Calories : "3560",
//         ImageURL : "/pics/steakclassic.jpeg",
//         TopMeal :  false
// },
// {
//         Title : "Butterfly Pasta",
//         ingredients : "",
//         Description : "with farfalle pasta which is tossed from our special pesto sauce and various toast options",
//         Category : "Classic Meals",
//         Price : "$17.00",
//         CookingTime : "8 minutes",
//         Calories : "1021",
//         ImageURL : "/pics/pestopasta.jpeg",
//         TopMeal :  false
// },
// {
//         Title : "Mexican Tacos(3)",
//         ingredients : "",
//         Description : "with lettuce, tomatoes, red peppers, corns, diced chicken, cajun and salsa served as side",
//         Category : "Featured Meals",
//         Price : "$19.99",
//         CookingTime : "25 minutes",
//         Calories : "890",
//         ImageURL : "/pics/tacosmexifeatured.jpeg",
//         TopMeal :  false
// },
// {
//         Title : "Spaghetti Meatballs",
//         ingredients : "",
//         Description : "with 3 meatballs bolognese sauce and cheddar shredded",
//         Category : "Featured Meals",
//         Price : "$20.00",
//         CookingTime : "20 minutes",
//         Calories : "890",
//         ImageURL : "/pics/topItem1.jpg",
//         TopMeal :  true
// },
// {
//         Title : "Apple Pie",
//         ingredients : "",
//         Description : "with caramel and white glaze sauce drizzled and extra mint",
//         Category : "Featured Meals",
//         Price : "$11.99",
//         CookingTime : "5 minutes",
//         Calories : "560",
//         ImageURL : "/pics/topItem3.jpg",
//         TopMeal :  true
// },
// {
//         Title : "Spicy Shrimp Rice",
//         ingredients : "",
//         Description : "with popcorn shrimps, red onions, red chillies and parsley for garnish",
//         Category : "Featured Meals",
//         Price : "$11.99",
//         CookingTime : "5 minutes",
//         Calories : "560",
//         ImageURL : "/pics/shrimpricefeatured.jpeg",
//         TopMeal :  false
// }
// ];

var allKits = [];
//Populating database
mealModel.find().count({}, (error, count) => {
    if (error) {
        console.log("Couldn't find: " + error);
    }
    else if (count === 0) {   
        mealModel.collection.insertMany(allKits,  (error, docs) => {
            if (error) {
                console.log("Couldn't insert: " + error);
            }
            else {
                console.log("Data was loaded, successfully");
            }
        });
    }
    else {
        console.log("All the data is established already");
    }
});

mealModel.find({})
.exec()
.then((Kits)=>{
    allKits = Kits.map(value=>value.toObject());
    module.exports.allKits = Kits.map(value=>value.toObject());
     console.log("Data rendered successfully")
     // Returning all objects
     module.exports.getCategoryKits = function(){
        var categoryKits = [];
        for(i=0;i < allKits.length;i++){
            let newCategory = categoryKits.find(temp=> temp.Category == allKits[i].Category);
            if(!newCategory){
                newCategory = {
                    Category : allKits[i].Category,
                    mealKits : []
                }
                categoryKits.push(newCategory);
            }
            newCategory.mealKits.push(allKits[i]);
         }
       return categoryKits;
    };
    //Returning Category objects
    
    module.exports.getTopMeals = function(){
        var TopMeal=[];
        for(i=0;i<allKits.length;i++){     
             if(allKits[i].TopMeal){
                    TopMeal.push(allKits[i]);
             }
        }
        return TopMeal;
     };
})
.catch(err=>{
    console.log(err);
});

module.exports.refresh = function(){
    mealModel.find({})
.exec()
.then((Kits)=>{
    allKits = Kits.map(value=>value.toObject());
    module.exports.allKits = Kits.map(value=>value.toObject());
     console.log("Data Refreshed successfully");
})
.catch(err=>{
    console.log(err);
});
}
