// passp.js
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const {getUsers} = require("./csv");

passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            //Find the user by username in the database
            const users = await getUsers();
            const user = users.find(u => u.username === username)
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