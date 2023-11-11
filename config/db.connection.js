const mongoose = require('mongoose')
require('dotenv').config()

mongoose.connect(process.env.MONGODB_URL)
.then(response => {
    console.log('Database Connection Successfull')
})
.catch(err => {
    console.log(err)
})  