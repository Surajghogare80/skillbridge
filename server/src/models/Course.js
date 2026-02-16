const mongoose = require("mongoose")

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  category: {
    type: String,
    required: true,
  },
  youTubeLink: {
    type: String,
    required: true,
  },
  duration: {
    type:String
  },
  level: {
    type: String,
    enum:["Beginner", "Intermediate", "Advanced"],
    default: "Beginner"
  }
}, {timestamps: true } ); 

module.exports = mongoose.model("Course", courseSchema);
