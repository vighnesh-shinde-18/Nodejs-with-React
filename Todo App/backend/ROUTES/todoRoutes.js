const express = require('express')
const router = express.Router();

const todo = require('../MODELS/todo');
const { json } = require('body-parser');

router.get('/test', (req, res) => {
    res.json({
        message: "The todo routes api is working"
    })
})

router.post('/createtodo', async (req, res) => {

    try {

        const { title, description } = req.body;
        const newTodo = new todo({
            title: title,
            description: description
        });

        const isExist = todo.find(newTodo);

        if (isExist == -1) {
            return res.status(400).json({
                message: "Todo already exist"
            })
        }
        await newTodo.save();
        res.status(200).json({
            message: 'Todo created succesfully'
        })
    } catch (error) {
        res.status(500).json({
            messege: error.message
        })
    }
})

router.get('/getalltodos', async (req, res) => {

    try {

        const todos = await todo.find();


        if (todos.length === 0) {
            return res.status(200).json({
                message: 'No todos exist',
            });
        }

        res.status(200).json({
            todos,
            message: 'Todos fetched succesfully'
        })
    } catch (error) {
        res.status(500).json({
            messege: error.message
        })
    }
})

router.get('/gettodo/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const reqTodo = await todo.findById(id);

        if (!reqTodo) {
            return res.status(200).json({
                message: 'todos Not found',
            });
        }

        res.status(200).json({
            reqTodo,
            message: 'Todo fetched succesfully'
        })
    }
    catch (err) {

        res.status(500).json({
            messege: err.message
        })
    }
})

router.post('/updatetodo/:id', async (req, res) => {
    try {
        const { title, description, completed } = req.body;

        const id = req.params.id;
        const reqTodo = await todo.findByIdAndUpdate(id, {
            title,
            description,
            completed
        });

        if (!reqTodo) {
            return res.status(200).json({
                message: 'todos Not found',
            });
        }

        res.status(200).json({
            reqTodo,
            message: 'Todo updated succesfully'
        })
    }
    catch (err) {

        res.status(500).json({
            messege: err.message
        })
    }
})

router.delete('/deletetodo/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const reqTodo = await todo.findById(id);

        if (!reqTodo) {
            return res.status(200).json({
                message: 'todos Not found',
            });
        }
        await todo.deleteOne(reqTodo);
        res.status(200).json({
            reqTodo,
            message: 'Todo deleted succesfully'
        })
    }
    catch (err) {

        res.status(500).json({
            messege: err.message
        })
    }
})

module.exports = router;