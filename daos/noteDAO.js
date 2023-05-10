const Note = require('../models/note');
const user = require('../models/user');

module.exports = {};

module.exports.createNote = async (userId, noteObj) => {
    const created = await Note.create({ userId:userId, text:noteObj });
    return created;
}

module.exports.getNote = async (userId, noteId) => {
    const getnote = await Note.find({ _id: noteId, userId }).lean();
    return getnote;
}

module.exports.getUserNotes = async (userId) => {
    const userNote = await Note.find({ userId: userId }).lean();
    return userNote;
}