const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const PORT = 8000;

require('dotenv').config();

const app = express()

require('./db');
const Todo = require('./MODELS/todo')

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('<h1>API World</h1>')
})

app.get('/gettodos', async (req, res) => {
    const allTodos = await Todo.find();
    res.json(allTodos);
})

app.post('/addtodo', async (req, res) => {
    const { task, complete} = req.body;
    const todo =  new Todo({
        task,
        complete
    })

    const saveTodo = await todo.save();
    res.json({
        message: 'Todo added successfully',
        savedTodo : saveTodo
    });
})

// [
//     {
//         "_id": "678669d8396e650d513922e2",
//         "task": "Go to colege",
//         "complete": false,
//         "__v": 0
//     },
//     {
//         "_id": "67866a3c396e650d513922e5",
//         "task": "Do breakfast",
//         "complete": false,
//         "__v": 0
//     },
//     {
//         "_id": "67866a9d396e650d513922e8",
//         "task": "come from college",
//         "complete": false,
//         "__v": 0
//     }
// ]

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
});