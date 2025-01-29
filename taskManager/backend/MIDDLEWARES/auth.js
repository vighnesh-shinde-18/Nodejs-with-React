const jwt = require('jsonwebtoken');
const user = require('../MODELS/user');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace("Bearer ", '');
        if (!token) {
            return res.status(401).send({ message: 'Token is missing' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const reqUser = await user.findOne({ _id: decoded._id });

        if (!reqUser) {
            throw new Error('Unable to find user, invalid credentials');
        }

        req.user = reqUser;
        req.token = token;

        next();
    } catch (error) {
        res.status(401).send({ message: error.message });
    }
};

module.exports = auth;
