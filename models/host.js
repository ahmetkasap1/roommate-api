const mongoose = require('mongoose')

const hostSchema = new mongoose.Schema({
    location : {type : String, required : true},
    hostType : {type : String, required : true},
    numberOfGuests : {type : Number, required: true},
    price : {type : Number, required : true},
    explanation : {type : String,},
    images : {type : [String], required : true},

    userRef : {type : mongoose.Schema.Types.ObjectId, ref : 'User'} //reference from user

})

const Host = mongoose.model('host', hostSchema)
module.exports = Host