const { Router } = require("express")
const router = Router();
const bcrypt = require("bcrypt");

const UserDAO = require('../daos/userDAO')
const TokenDAO = require('../daos/tokenDAO')

router.post("/signup", async (req, res, next) => {
    if (!req.body.password || JSON.stringify(req.body.password) === '' ) {
        res.status(400).send('password is required');
    } else {
        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const user = {
                email: req.body.email,
                password: hashedPassword
            }
            
            const savedUser = await UserDAO.createUser(user, user.email)
            if ( savedUser === 'exists'){
                res.status(409).send('password is required') //409 - from test console
            } else {
                res.json(savedUser)
            }
        } catch(e) {
            res.status(500).send(e.message);
        }
    }
    // test ignore
});

router.post("/", async (req, res, next) => {
    // console.log(req.body)
    if (!req.body.password || JSON.stringify(req.body.password) === '' ) {
        res.status(400).send('password is required');
    } else {
        try {
            const user = await UserDAO.getUser(req.body.email);
            // console.log(user)
            const result = await bcrypt.compare(req.body.password, user.password);
            if (!result) {
                res.status(401).send("password doesn't match");
            } else {
                const userToken = await TokenDAO.makeTokenForUserId(user._id);
                res.json({ token: userToken });
            }
        } catch(e) {
            res.status(401).send(e.message);
        }
    }
});

router.post("/password", async (req, res, next) => {
    if (!req.body.password || JSON.stringify(req.body.password) === '' ) {
        res.status(400).send('password is required');
    } else if (!req.userId) {
        res.status(401).send("user not found");
    } else {
        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10); // use 10 for course
            const success = await UserDAO.updateUserPassword(req.userId, hashedPassword);
            res.sendStatus(success ? 200 : 401);
        } catch(e) {
            res.status(500).send(e.message);
        }
    }
});

router.post("/logout", async (req, res, next) => {
    if (!req.userId) {
        res.status(401).send("token doesn't match");
    } else {
        try {
            const tokenString = req.headers.authorization.slice(7);
            const success = await UserDAO.removeToken(tokenString);
            res.sendStatus(success ? 200 : 401);
        } catch(e) {
            res.status(500).send(e.message);
        }
    }
});



module.exports = router;