const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    avatar : {type : String, default:"https://cdn-icons-png.flaticon.com/512/6596/6596121.png"},
    name : {type : String, trim : true, required:true},
    lastname : {type : String, trim : true, required:true},
    email : {type : String, trim : true, unique : true, required:true },
    password : {type : String, trim : true, required : true},
    location : {type : String, trim : true},
    language : {type : [String], trim : true},
    school : {type : String, trim : true},
    work : {type : String, trim : true},
    about : {type : String, trim : true},
    favorites : {type : [mongoose.Schema.Types.ObjectId]},
    reset : {
        code : {type : String, default : null},
        time : {type : Date, default : null}
    }

}, {collection : "users", timestamps:true})

const User = mongoose.model('users', userSchema)
module.exports = User