const { Router } = require("express")
const router = Router();

const NoteDAO = require('../daos/noteDAO')
const TokenDAO = require('../daos/tokenDAO')

// Mideleware
router.use(async function (req, res, next){
    const userAuth = req.headers.authorization;
    if (!userAuth){
        res.sendStatus(401);
    } else {
        const token = userAuth.slice(7)
        const userIdFromToken = await TokenDAO.getUserIdFromToken(token)
        if (userIdFromToken){
            req.userId = userIdFromToken
            next();
        } else {
            res.sendStatus(401);
        }
    }
});


router.post("/", async (req, res, next) => {
    try{
        const createdNote = await NoteDAO.createNote(req.userId, req.body.text)
        const savedNote = createdNote.text
        res.json(createdNote)
    } catch(e) {
        res.status(500).send(e.message);
    }
});

router.get("/", async (req, res, next) => {
    try{
        if (!req.userId){
            res.status(401).send("no valid token")
        } else {
            const getNote = await NoteDAO.getUserNote(req.userId)
            return res.json(getNote)
        }
    } catch(e) {
        res.status(500).send(e.message);
    }
});

router.get("/:id", async (req, res, next) => {
    try{
        if (!req.userId){
            res.status(400).send("no token")
        } else {
            const getNoteById = await NoteDAO.getNote(req.userId, req.params.id)
            console.log(getNoteById)
            if (getNoteById.length === 0) {
                res.status(404)
            } else if (!getNoteById) {
                res.sendStatus(400)
            } else {
                return res.json(getNoteById[0])
            }
        }
    } catch(e) {
        res.status(500).send(e.message);
    }
});


module.exports = router;