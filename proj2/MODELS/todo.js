const mongoose = require('mongoose')

const todoSchema = new mongoose.Schema({
    task: {
        type: String,
        required: true
    },
    complete: {
        type: Boolean,
        default: false
    }
})

const Todo = mongoose.model('todo',todoSchema);

module.exports = Todo;


// name: {
//     type: String
// },
// age: {
//     type: Number,
//     default: 18,
//     min: 18,
//     max: 65
// },
// email: {
//     type: String,
//     match: /^\S+@\S+\.\S+$/,
//     unique: true
// },
// password: {
//     type: String,
//     required: true
// },
// date: {
//     type: Date,
//     default: Date.now()
// }