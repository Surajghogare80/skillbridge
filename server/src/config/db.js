const mongoose = require("mongoose");//Import Mongoose library for MongoDB interactions

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected");
    } catch (error) {
        console.log("MongoDB connection failed", error);
        process.exit(1);//Exit the process with failure code
    }
};

module.exports = connectDB;//Export the connectDB function for use in server.js