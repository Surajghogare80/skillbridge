const admin = require("../config/firebaseAdmin");

/**
 * Middleware to verify Firebase ID Token
 */
exports.verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ 
                success: false, 
                message: "Access denied. No token provided or invalid format." 
            });
        }

        const token = authHeader.split(" ")[1];
        
        // Verify token with Firebase Admin
        const decodedToken = await admin.auth().verifyIdToken(token);
        
        // Find user in MongoDB
        const User = require("../models/User");
        const mongoUser = await User.findOne({ firebaseUID: decodedToken.uid });

        // Attach user info to request
        req.user = {
            uid: decodedToken.uid,
            email: decodedToken.email,
            email_verified: decodedToken.email_verified,
            name: decodedToken.name || '',
            picture: decodedToken.picture || '',
            mongoId: mongoUser ? mongoUser._id : null,
            role: mongoUser ? mongoUser.role : 'student'
        };
        
        next();
    } catch (error) {
        console.error("Firebase verify error:", error.message);
        res.status(401).json({ 
            success: false, 
            message: "Invalid or expired token.",
            error: error.code 
        });
    }
};