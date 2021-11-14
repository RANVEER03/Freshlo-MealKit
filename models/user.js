//Establishing bcrypt
const bcrypt = require("bcryptjs");
// Establishing mongoose
const mongoose = require("mongoose");
const schema = mongoose.Schema;

const userSchema = new schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    emailaddress: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    dateCreated: {
        type: Date,
        default: Date.now()
    }
});

userSchema.pre("save", function(skip){
    let getUser = this;
    bcrypt.genSalt(10)
    .then(salt => {
        bcrypt.hash(getUser.password, salt)
        .then(hashedPass => {        
            getUser.password = hashedPass;
            skip();
        })
        .catch(err => {
            console.log(`Cannot hash because of ${err}`);    
        })
    })
    .catch(err => {
        console.log(`Cannot salt because of ${err}`);
    })
}
);

const userModel = mongoose.model("allUsers", userSchema);
module.exports = userModel;