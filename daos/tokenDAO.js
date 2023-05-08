const Token = require('../models/token')
const uuid = require('uuid')

module.exports.makeTokenForUserId = async (userId) => {
    const token = uuid.v4();
    const newToken = await Token.create({ userId, token });
    return newToken.token
  }
  
module.exports.getUserIdFromToken = async (tokenString) => {
    const tokenRecord = await Token.findOne({ token: tokenString }).lean();
    if (tokenRecord) {
        return tokenRecord.userId
    } else {
        return undefined
    }
}

module.exports.removeToken = async (tokenString) => {
    await Token.deleteOne({ token: tokenString });
    return true
  }