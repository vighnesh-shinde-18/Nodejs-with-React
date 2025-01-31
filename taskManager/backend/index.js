const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const db = require('./db')
const userRouter = require('./ROUTES/userRoutes')
const taskRouter = require('./ROUTES/taskRoutes')

app.use(cors())
app.use(bodyParser.json())
require('dotenv').config();
const port = process.env.PORT 

app.use('/users', userRouter)
app.use('/tasks', taskRouter)

app.get('/', (req,res)=>{
    res.send('api working')
})

app.listen(port,()=>{
    console.log("api is listning")
});

