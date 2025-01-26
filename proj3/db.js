const mongoose = require('mongoose')
require('dotenv').config();

mongoose.connect(process.env.MONGO_URL, {dbName : process.env.DB_NAME}).then(() => {
    console.log('coonected to the database')
})
    .catch((err) => {
        console.log("error for connecting to the server ", err)
    })



