const Token = require('../models/token')
const uuid = require('uuid')

module.exports = {};

module.exports.makeTokenForUserId = async (userId) => {
    const token = uuid.v4();
    const newToken = await Token.create({userId:userId, token:token});
    return newToken
  }
  
module.exports.getUserIdFromToken = async (tokenString) => {
    const tokenRecord = await Token.findOne({ token: tokenString });
    if (tokenRecord) {
        return tokenRecord.userId
    } else {
        return false
    }
}

module.exports.removeToken = async (tokenString) => {
    await Token.deleteOne({ token: tokenString });
    return true
}