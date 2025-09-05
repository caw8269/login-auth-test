// passp.js
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models");
const bcrypt = require("bcrypt");

passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            //Find the user by username in the database
            const user = await User.findOne({ username });
            //if the user does not exist, return an error
            if(!user) {
                return done(null, false, { error: "Incorrect Username" });
            }

            //Compare the provided password with the
            //hashed password in the database
            const passwordMatch = await bcrypt.compare(
                password,
                user.password
            );

            //If the passwords match, return the user object
            if(passwordMatch){
                return done(null, user);
            } else {
                //If the passwords do not match, return an error
                return done(null, false, { error: "Incorrect password"});
            }
        } catch(err){
            return done(err);
        }
    })
)