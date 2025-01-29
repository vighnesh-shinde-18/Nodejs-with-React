const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const Todo = require('./MODELS/todo')
const port = process.env.PORT || 8000;
const todoRoutes = require('./ROUTES/todoRoutes')
app.use(cors())

require('./db')

require('dotenv').config()

app.use(bodyParser.json())


app.get('/', (req, res) => {
    res.json({
        messege: 'This API is working'
    })
})

app.use('/todoRoutes', todoRoutes);

app.listen(port, () => {
    console.log('MONGO_URL:', process.env.MONGO_URL);
    console.log('DB_NAME:', process.env.DB_NAME);

    console.log(`app working on port ${port}`)
})