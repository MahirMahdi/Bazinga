const mongoose = require('mongoose');
const Conversation = require('./conversation')
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require('mongoose-findorcreate');

const User = new mongoose.Schema({
    username:{
        type: String,
        min:4,
        max:80
    },
    img:{
        type:String,
    },
    email:{
        type: String,
        max:40,
        unique: true,
    },
    password:{
        type: String,
        required: false,
        min:8,
        max:40,
    },
    conversation:[Conversation]
},
    {timestamps:true}
)

User.plugin(passportLocalMongoose);
User.plugin(findOrCreate);

module.exports.User = mongoose.model("User", User);