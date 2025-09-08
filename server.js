// Server.js

// Imports //
const express = require("express");
const passport = require("passport");
const User = require("./models.js");
const localStrategy = require("./passp.js");
const controllers = require("./controller.js");
const cookieParser = require("cookie-parser");
const connectDB = require("./db");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const routes = require("./pages.js");
const session = require("express-session");

// Main Server //
const app = express()
connectDB()
app.use(
    session({
        secret: "GFGLogin346",
        resave: false,
        saveUninitialized: false,
    })
);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(passport.initialize());
app.use(passport.session());
app.set("view engine", "ejs");

//serialize and deserialize user objects to maintain user sessions
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user));
});
//Use the routes
app.use("/api/", controllers);
app.use("/", routes);

//start the server
const port = 3000;
const server = app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

// Listen for 'close' command from stdin in the terminal
if (process.stdin.isTTY) {
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (data) => {
        if (data.trim() === 'close') {
            server.close(() => {
                console.log('Server closed by terminal command');
                process.exit(0);
            });
        }
    });
}