const express = require('express');
const app = express();
const PORT = 3000;

const userRoutes = require('./controllers/userRoutes')
const cors = require('cors');
const bodyParser = require('body-parser');

// app.get('/',(req,res)=>{
//     res.status(200).send('hello world');
// })

// app.get('/about',(req,res)=>{
//     res.status(200).send('About page');
// })

// app.get('*',(req,res)=>{
//     res.status(404).send('not found page');
// })

// app.use((req,res,next)=>{
//     res.status(404).send(`<h1>Page not foundon the server 404 </h1>`)
// })

app.use(bodyParser.json());

// cors ->  localhost:3000, localhost:3001
// const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001'];

// app.use(cors({
//     origin: function (origin, callback) {
//         console.log('origin ', origin);
//         if (!origin) {
//             return callback(null, true);
//         }
//         if (allowedOrigins.includes(origin)) {
//             return callback(null, true);
//         }
//         else {
//             return callback(new Error('Not allowed by CORS'))
//         }
//     }
// }));


app.use('/userapis', userRoutes);

app.get('/', (req, res) => {
    res.status(200).send({
        "messege": "The API is working"
    })
})

app.listen(PORT, () => {
    console.log(`app listinging on port ${PORT}`)
})

let arr = [1,2,3,34,5,6]
