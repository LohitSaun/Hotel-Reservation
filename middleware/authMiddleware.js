const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Expecting 'Bearer <token>'

    if (!token) {
        console.log('No token');
        return res.status(403).json({ error: 'No token provided' });
    }

    jwt.verify(token,  'your_secret_key' , (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Failed to authenticate token' });
        }
        console.log('Decoded token:', decoded);  // Log the decoded token
        req.user = decoded;  // Store decoded user info in the request
        next();
    });
};

const isAdmin = (req, res, next) => {
    // console.log('Decoded user from token:', req.user); // Log the decoded user
    if (req.user && req.user.role === 'admin') {
        next(); // Proceed if user is an admin
    } else {
        return res.status(403).json({ error: 'Access denied: Admins only' });
    }
};

module.exports = { verifyToken, isAdmin };
