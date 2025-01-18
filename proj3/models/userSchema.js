const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    age: {
        type: Number
    },
    gender: {
        type: String
    },
    refreshToken:{
        type: String
    }
})

module.exports = mongoose.model("user", userSchema)