require("dotenv").config();//Load environment variables from .env file
const app = require("./src/app");//imports Express app from app.js
const connectDB = require("./src/config/db");//imports database connection function from db.js
connectDB();//Connect MongoDB now
const PORT = process.env.PORT || 5000;//Set the port for the server, default to 5000 if not specified in environment variables

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
