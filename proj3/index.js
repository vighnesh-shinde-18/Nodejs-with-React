const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const port = 8000;
require('dotenv').config();
require('./db');

const User = require('./models/userSchema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const cookieParser = require('cookie-parser')

const imageUploadRoutes = require('./controllers/imageUploadsRoutes')

app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

function authenticateToken(req, res, next) {
    const accessToken = req.headers.authorization?.split(" ")[1];    
    
    if (!accessToken) {
        return res.status(401).json({ message: "Auth error: No token provided" });    
    }
    
    try {
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);    
        req.user = decoded; // Attach the decoded token (including id) to req.user
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid token" });    
    }
}

// Routes
app.get('/', (req, res) => {
    console.log('API is working');    
    res.json({ message: "Hi, I am working!" });
});


app.post('/register', async (req, res) => {
    try {
        const { name, password, email, age, gender } = req.body;    

        if (!name || !email || !password || !age || !gender) {
            return res.status(400).json({ message: "All fields are required" });    
        }
        
        const existingUser = await User.findOne({ email });
        
        if (existingUser) {
            return res.status(409).json({ message: 'Email already exists' });    
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const newUser = new User({ name, password: hashedPassword, email, age, gender });
        await newUser.save();
        
        res.status(201).json({ message: 'New user successfully created' });
    } catch (err) {
        res.status(500).json({ message: err.message });    
    }
});


app.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;    
        const existingUser = await User.findOne({ email });
        
        if (!existingUser) {
            return res.status(403).json({ message: 'Invalid username' });    
        }

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) {
            return res.status(403).json({ message: 'Invalid password' });    
        }
        
        const accessToken = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: '40s' });
        const refreshToken = jwt.sign({ id: existingUser._id }, process.env.JWT_REFRESH_SECRET_KEY);
        
        existingUser.refreshToken = refreshToken;
        await existingUser.save();
        
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,    
            path: '/refreshToken',
            secure: false, // Set to true if using HTTPS
            sameSite: 'strict',
        });
        
        res.status(200).json({ accessToken, refreshToken, message: 'User logged in successfully' });
    } catch (err) {
        next(err);    
    }
});
app.get('/getmyprofile', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id; // Use the id from req.user set in authenticateToken    
        const userProfile = await User.findById(userId);

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
        const existingUser = await User.findById(id);
        
        if (!existingUser || token !== existingUser.refreshToken) {
            return res.status(401).json({ message: "Invalid refresh token" });    
        }
        
        const accessToken = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: "40s"    
        });
        
        const refreshToken = jwt.sign({ id: existingUser._id }, process.env.JWT_REFRESH_SECRET_KEY)

        existingUser.refreshToken = refreshToken;
        await existingUser.save();
        
        res.cookie("refreshToken", refreshToken, { httpOnly: true, path: '/refreshToken' });
        
        res.status(200).json({ message: 'Token refreshed succesfully', accessToken, refreshToken });
    });
});


// app.get('/getByGender', async (req, res) => {
    //     const { gender } = req.body;    
    
    //     const sortedUsers = await user.find({ gender: gender })
    //     res.status(200).json({sortedUsers});
    // })
    
    // app.post('/getByGender', async (req, res) => {
        //     const { gender } = req.body;    
        
        //     const sortedUsers = await user.find();
        
        //     res.status(200).json({ sortedUsers });
        
        // });
        
        app.post('/getByGender', async (req, res) => {
            const { gender } = req.body;    
            
            const users = await User.find({ gender: gender })
            res.send(200).json({ User })
        })
        
        
        app.post('/sortUsers', async (req, res) => {
            const {sortby , order} = req.body;    
            
            const sort = {
                [sortby] : order    
   }

   console.log(sort);
   
   const users = await User.find().sort(sort);
   
   res.status(200).json({ users });
});

// Error handling middleware
app.use('/imageupload', imageUploadRoutes)

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;    
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({ message: message });
});


app.listen(port, () => {
    console.log(`Server listening on port ${port}`);    
});
// Error handling middleware







