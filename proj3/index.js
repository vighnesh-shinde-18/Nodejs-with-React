const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const port = 3000;
require('dotenv').config();
require('./db');

const user = require('./models/userSchema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const cookieParser = require('cookie-parser')

app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser()); 

// Middleware for token authentication
function authenticateToken(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        // return res.status(401).json({ message: "Auth error: No token provided" });
        const error = new Error('token not found ')
        next(error)
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if (req.body.id && decoded.id !== req.body.id) {
            // return res.status(401).json({ message: "Invalid Token" });
            const error = new Error('Invalid Token')
            next(error);
        }

        req.user = decoded; // Attach the decoded token (including id) to req.user
        next();
    } catch (err) {
        // return res.status(401).json({ message: "Invalid token" });
        next(err)
    }
}

// Routes
app.get('/', (req, res) => {
    console.log('API is working');
    res.send("Hi, I am working!");
});

app.post('/register', async (req, res) => {
    try {
        const { name, password, email, age, gender } = req.body;

        if (!name || !email || !password || !age || !gender) {
            const error = new Error("")
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await user.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ message: 'Email already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new user({
            name,
            password: hashedPassword,
            email,
            age,
            gender
        });

        await newUser.save();
        res.status(201).json({ message: 'New user successfully created' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await user.findOne({ email });

        if (!existingUser) {
            // return res.status(403).json({ message: 'Invalid username' });
            const error = new Error('Invalid username')
            next(error)
        }

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) {
            // return res.status(403).json({ message: 'Invalid password' });
            const error = new Error('Invalid password')
            next(error)
        }

        const accessToken = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: '40s'
        });
    
        const refreshToken = jwt.sign({ id: existingUser._id }, process.env.JWT_REFRESH_SECRET_KEY)

        existingUser.refreshToken = refreshToken;
        await existingUser.save();
        res.cookie("refreshToken", refreshToken, { httpOnly: true, path: '/refreshToken' });

        res.cookie('refreshToken', refreshToken, { 
            httpOnly: true, 
            path: '/refreshToken', 
            secure: false, // Set to true if using HTTPS
            sameSite: 'strict',
        });

        res.status(200).json({
            accessToken,
            refreshToken,
            message: "User logged in successfully"
        });

    } catch (err) {
        // res.status(500).json({ message: err.message });
        next(err)
    }
});

app.get('/getmyprofile', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id; // Use the id from req.user set in authenticateToken
        const userProfile = await user.findById(userId);

        if (!userProfile) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ user: userProfile });
    } catch (err) {
        // res.status(500).json({ message: err.message });
        next(err)
    }
});


app.get('/refreshToken', (req, res, next) => {
    const token = req.cookies.refreshToken;
    
    if (!token) {
        const error = new Error('Refresh token not found');
        return next(error);
    }
    
    jwt.verify(token, process.env.JWT_REFRESH_SECRET_KEY, async (err, decoded) => {
        if (err) {
            const error = new Error('Invalid refresh token');
            return next(error);
        }
        
        const id = decoded.id;
        const existingUser = await user.findById(id);
        
        if (!existingUser || token !== existingUser.refreshToken ) {
            return res.status(401).json({ message: "Invalid refresh token" });
        }
        
        const accessToken = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET_KEY, {
            expiresIn:"40s"
        });
        
       const refreshToken = jwt.sign({ id: existingUser._id }, process.env.JWT_REFRESH_SECRET_KEY)

       existingUser.refreshToken = refreshToken;
       await existingUser.save();

       res.cookie("refreshToken", refreshToken, { httpOnly: true, path: '/refreshToken' });

        res.status(200).json({ message: 'Token refreshed succesfully', accessToken, refreshToken });
    });
});





// Error handling middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({ message: message });
});



app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
