var allKits = [
{
    categoryName: "Classic Meals",
    mealKits: [
        {
            Title : "Chicken Caesar Salad",
            ingredients : "Romania, caesar, bacon, lime wedge, croutons",
            Description : "with bacon, croutons shredded and extra dressing on side",
            Category : "Classic Meals",
            Price : "$14.99",
            CookingTime : "25 minutes",
            Calories : "890",
            ImageURL : "/pics/topItem2.jpg",
            TopMeal :  true
    },
    {
        Title : "Korean Tofu",
        ingredients : "",
        Description : "with tofu, citrus dressing tossed in broccoli and carrots",
        Category : "Classic Meals",
        Price : "$15.50",
        CookingTime : "10 minutes",
        Calories : "1102",
        ImageURL : "/pics/tofuriceclassic.jpeg",
        TopMeal :  false
    },
    {
        Title : "Steak House",
        ingredients : "",
        Description : "with medium well steak that can be cooked further and bomb tomatoes as salad",
        Category : "Classic Meals",
        Price : "$23.14",
        CookingTime : "20 minutes",
        Calories : "3560",
        ImageURL : "/pics/steakclassic.jpeg",
        TopMeal :  false
    },
    {
        Title : "Butterfly Pasta",
        ingredients : "",
        Description : "with farfalle pasta which is tossed from our special pesto sauce and various toast options",
        Category : "Classic Meals",
        Price : "$17.00",
        CookingTime : "8 minutes",
        Calories : "1021",
        ImageURL : "/pics/pestopasta.jpeg",
        TopMeal :  false
    }
    ]   
},
{
    categoryName: "Featured Meals",
    mealKits: [{
        Title : "Mexican Tacos(3)",
        ingredients : "",
        Description : "with lettuce, tomatoes, red peppers, corns, diced chicken, cajun and salsa served as side",
        Category : "Classic Meals",
        Price : "$19.99",
        CookingTime : "25 minutes",
        Calories : "890",
        ImageURL : "/pics/tacosmexifeatured.jpeg",
        TopMeal :  false
    },
    {
        Title : "Spaghetti Meatballs",
        ingredients : "",
        Description : "with 3 meatballs bolognese sauce and cheddar shredded",
        Category : "Classic Meals",
        Price : "$20.00",
        CookingTime : "20 minutes",
        Calories : "890",
        ImageURL : "/pics/topItem1.jpg",
        TopMeal :  true
    },
    {
        Title : "Apple Pie",
        ingredients : "",
        Description : "with caramel and white glaze sauce drizzled and extra mint",
        Category : "Classic Meals",
        Price : "$11.99",
        CookingTime : "5 minutes",
        Calories : "560",
        ImageURL : "/pics/topItem3.jpg",
        TopMeal :  true
    },
    {
        Title : "Spicy Shrimp Rice",
        ingredients : "",
        Description : "with popcorn shrimps, red onions, red chillies and parsley for garnish",
        Category : "Classic Meals",
        Price : "$11.99",
        CookingTime : "5 minutes",
        Calories : "560",
        ImageURL : "/pics/shrimpricefeatured.jpeg",
        TopMeal :  false
    }
    ]  
}
];
// my local array is allkits having two categories in it
module.exports.getCategoryKits = function(){
   return allKits;
};

module.exports.getTopMeals = function(){
   var TopMeal=[];
   for(var i=0;i<allKits.length;i++){
       for(var j=0;j<allKits[i].mealKits.length;j++){
           if(allKits[i].mealKits[j].TopMeal){
               TopMeal.push(allKits[i].mealKits[j]);
           }
       }
   }
   return TopMeal;
};