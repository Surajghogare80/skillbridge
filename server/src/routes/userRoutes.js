const express = require('express');
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const authController = require('../controllers/authController');


router.post('/enroll/:courseId', verifyToken, authController.enrollCourse);
router.get('/my-courses', verifyToken, authController.getMyCourses);

module.exports = router;
