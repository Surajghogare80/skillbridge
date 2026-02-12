const express = require("express");//Import Express framework
const cors = require("cors");//Allows frontend (React) to talk to backend safely.
const app = express();//Create my backend server.
app.use(cors());//Allow requests from frontend
app.use(express.json());//This allows backend to read JSON data.

app.get("/" , (req,res) => {
    res.send("SkillBridge Backend is running 🚀");
});

module.exports = app;//Export the Express app for use in server.js