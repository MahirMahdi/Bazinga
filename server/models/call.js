const mongoose = require('mongoose');

const Call = new mongoose.Schema({
    type:String,
    status:String,
    duration:String
},{timestamps:true})

module.exports = Call