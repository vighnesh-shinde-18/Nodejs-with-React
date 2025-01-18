const mongoose = require('mongoose')
require('dotenv').config();

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log('coonected to the database')
})
    .catch((err) => {
        console.log("error for connecting to the server ", err)
    })