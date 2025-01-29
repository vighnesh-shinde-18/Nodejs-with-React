const mongoose = require('mongoose')

require('dotenv').config();

const mongoUri = process.env.MONGO_URL;
const dbName = process.env.DB_NAME;

mongoose.connect(mongoUri, {
    dbName: dbName
}).then(() => {
    console.log('Connected to MongoDB')
})
    .catch((err) => {
        console.log("Mongodb connection failed ", err)
    })
