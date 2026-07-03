const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        firebaseUID: {
            type: String,
            required: true,
            unique: true,
        },
        authProvider: {
            type: String,
            enum: ['google', 'email'],
            required: true,
        },
        profileImage: {
            type: String,
            default: '',
        },
        role: {
            type: String,
            enum: ['student', 'admin', 'instructor'],
            default: 'student',
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        lastLogin: {
            type: Date,
            default: Date.now,
        },
        enrolledCourses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Course',
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);