const User = require('../models/User');
const rateLimit = require('express-rate-limit');

// Rate limiting for auth routes
exports.authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: "Too many requests from this IP, please try again after 15 minutes"
    }
});

/**
 * Synchronize Firebase user with MongoDB
 * This handles both first-time signup and returning login
 */
exports.syncUser = async (req, res) => {
    try {
        const { uid, email, name, picture, email_verified } = req.user;
        const { authProvider } = req.body; // 'google' or 'email'

        // Check if user exists in MongoDB
        let user = await User.findOne({ firebaseUID: uid });

        if (!user) {
            // New user - Create in MongoDB
            user = new User({
                fullName: name || 'User',
                email: email,
                firebaseUID: uid,
                authProvider: authProvider || (picture ? 'google' : 'email'),
                profileImage: picture || '',
                isEmailVerified: email_verified || false,
                lastLogin: new Date()
            });
            await user.save();
            console.log(`New user created: ${email}`);
        } else {
            // Existing user - Update lastLogin and potentially other info
            user.lastLogin = new Date();
            user.isEmailVerified = email_verified || user.isEmailVerified;
            
            // If user logged in with Google, maybe update their picture/name
            if (picture) user.profileImage = picture;
            if (name && !user.fullName) user.fullName = name;
            
            await user.save();
            console.log(`User logged in: ${email}`);
        }

        res.status(200).json({
            success: true,
            message: "User synchronized successfully",
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                profileImage: user.profileImage,
                isEmailVerified: user.isEmailVerified
            }
        });

    } catch (error) {
        console.error("Sync user error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error during user synchronization",
            error: error.message
        });
    }
};

// Placeholder for other auth methods if needed
exports.register = async (req, res) => {
    res.status(400).json({ message: "Use Firebase for registration and call /sync" });
};

exports.login = async (req, res) => {
    res.status(400).json({ message: "Use Firebase for login and call /sync" });
};

exports.enrollCourse = async (req, res) => {
    // This would normally be in a course controller, but keeping it for now to avoid breaking existing routes
    try {
        const { courseId } = req.params;
        const userId = req.user.uid; // Firebase UID

        const user = await User.findOne({ firebaseUID: userId });
        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.enrolledCourses.includes(courseId)) {
            return res.status(400).json({ message: "Already enrolled in this course" });
        }

        user.enrolledCourses.push(courseId);
        await user.save();

        res.status(200).json({ success: true, message: "Enrolled successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMyCourses = async (req, res) => {
    try {
        const userId = req.user.uid;
        const user = await User.findOne({ firebaseUID: userId }).populate('enrolledCourses');
        
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        res.status(200).json({ 
            success: true, 
            courses: user.enrolledCourses 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
