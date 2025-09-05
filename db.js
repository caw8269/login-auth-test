//db.js
const mongoose = require("mongoose");

//mongoose connection
const connectDB = async () => {
    mongoose.connect("mongodb:127.0.0.1:27017/LoginAuth", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Error connecting to MongoDB:", err));
};

module.exports = connectDB;