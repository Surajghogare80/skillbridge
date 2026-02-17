const express = require('express');
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");


const courseController = require('../controllers/courseController');

// Create a new course
router.post('/', verifyToken, courseController.createCourse);
// Get all courses
router.get('/', courseController.getAllCourses);
// Get a course by ID
router.get('/:id', courseController.getCourseById);
// Delete a course by ID
router.delete('/:id', verifyToken, courseController.deleteCourseById);
// Update a course by ID
router.put('/:id', verifyToken, courseController.updateCourseById);

module.exports = router;