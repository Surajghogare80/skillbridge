const mongoose = require("mongoose");//Import Mongoose library for MongoDB interactions
const dns = require("dns");

// Force c-ares resolver to use Google's public DNS servers to resolve MongoDB SRV records
try {
    dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (err) {
    console.warn("Could not set custom DNS servers, using system default:", err.message);
}

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