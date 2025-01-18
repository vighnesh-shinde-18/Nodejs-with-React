const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const dataFilePath = path.join(__dirname, '../userDatabase.json');

router.use(express.json());


function readDataFromFile() {
    const data = fs.readFileSync(dataFilePath);
    return JSON.parse(data);
}

function writeDataToFile(newData) {
    fs.writeFileSync(dataFilePath, JSON.stringify(newData, null, 2));
}

router.get('/users', (req, res) => {
    const users = readDataFromFile();
    res.send(users);
});

router.get('/users/:id', (req, res) => {
    const users = readDataFromFile();
    const userId = req.params.id;

    const user = users.find((ele) => ele.id == userId); // Use find instead of filter

    if (user) {
        res.send(user);
    } else {
        res.status(404).send({ error: 'User not found' });
    }
});


router.get('/', (req, res) => {
    res.send({
        message: 'Welcome to the user API',
        path: dataFilePath,
    });
});

// Route to add a new user
router.post('/users', (req, res) => {
    const users = readDataFromFile();
    const newUser = req.body;
    newUser.id = new Date().getTime(); // Generate unique ID

    users.push(newUser);
    writeDataToFile(users);

    res.send(users);
});

// Route to update user data by ID
router.put('/users/:id', (req, res) => {
    const users = readDataFromFile();
    const userId = req.params.id;
    const userUpdatedData = req.body;

    const userIndex = users.findIndex((ele) => ele.id == userId); // Use findIndex to get the index

    if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...userUpdatedData };
        writeDataToFile(users);
        res.send(users);
    } else {
        res.status(404).send({ error: 'User not found' });
    }
});

router.delete('/users/:id',(req,res)=>{
    const users = readDataFromFile();
    const userId = req.params.id;

    const userIndex = users.findIndex((ele) => ele.id == userId); // Use findIndex to get the index

    if (userIndex !== -1) {
       users.splice(userIndex,1)
        writeDataToFile(users);

        res.send(users);
    } else {
        res.status(404).send({ error: 'User not found' });
    }
})



module.exports = router;
