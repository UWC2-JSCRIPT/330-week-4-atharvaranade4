const { Router } = require("express")
const router = Router();
const bcrypt = require("bcrypt");

const UserDAO = require('../daos/userDAO')
const TokenDAO = require('../daos/tokenDAO')

router.post("/", async (req, res, next) => {
    if (!req.body.password || JSON.stringify(req.body.password) === '' ) {
        res.status(400).send('password is required');
    } else {
        try {
            const user = await UserDAO.getUser(req.body.email);
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

module.exports = router;