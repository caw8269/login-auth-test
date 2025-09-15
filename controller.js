//controller.js
const express = require("express")
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcrypt");
const { getUsers, addUser } = require("./csv");

//user registration route
router.post("/register", async (req, res) => {
    const { username, password } = req.body;
    const users = await getUsers();
    if (users.find(u => u.username === username)) {
        return res.render('register', { error: 'Username already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await addUser({ username, password: hashedPassword });
    res.redirect('/login');
});

//User login route
router.post("/login", async (req, res) => {
    let sentResponse = false;
    try {
        const { username, password } = req.body;
        const users = await getUsers();
        const user = users.find(u => u.username === username);
        if (!user) {
            if (!sentResponse) {
                sentResponse = true;
                return res.render('login', { error: 'Invalid username or password' });
            } else {
                console.error('Second response attempted: user not found');
                return;
            }
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            if (!sentResponse) {
                sentResponse = true;
                return res.render('login', { error: 'Invalid username or password' });
            } else {
                console.error('Second response attempted: password mismatch');
                return;
            }
        }
        req.session.name = username;
        req.session.save((err) => {
            console.log("test");
            if (sentResponse) {
                console.error('Second response attempted: session save callback');
                return;
            }
            if (err) {
                sentResponse = true;
                return res.render('login', { error: 'Session error, please try again.' });
            }
            sentResponse = true;
            return res.redirect("/");
        });
    } catch (error) {
        if (!sentResponse) {
            sentResponse = true;
            res.status(500).send('Internal server error');
        } else {
            console.error('Second response attempted: exception', error);
        }
    }
});

router.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("./")
});
module.exports = router;