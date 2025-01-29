const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            require: true
        },
        description: {
            type: String,
            require: false
        },
        completed: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

const Todo = mongoose.model('Todo', todoSchema)
module.exports = Todo;

