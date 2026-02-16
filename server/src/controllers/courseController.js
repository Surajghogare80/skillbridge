const Course = require("../models/Course");

// Create a new course
exports.createCourse = async (req, res) => {
  try {
    const { title, description, category, youTubeLink, duration, level } =
      req.body;
    const course = new Course({
      title,
      description,
      category,
      youTubeLink,
      duration,
      level,
    });
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a course by ID
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//Delete course by ID
exports.deleteCourseById = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update course by ID
exports.updateCourseById = async (req, res) => {
  try {
    const { title, description, category, youTubeLink, duration, level } =
      req.body;

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { title, 
        description,
         category,
          youTubeLink,
           duration,
            level },
      { new: true }, // Return the updated document
    );
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
