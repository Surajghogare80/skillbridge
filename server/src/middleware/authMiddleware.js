const jwt = require("jsonwebtoken");//For creating and verifying JWT tokens

// Middleware to protect routes
exports.verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if(!authHeader) {
            return res.status(401).json({ message: "Access denied. No token provided." });
        }
        
        const token = authHeader.split(" ")[1]; // Extract token from "Bearer <token>"
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token." });
    }
};