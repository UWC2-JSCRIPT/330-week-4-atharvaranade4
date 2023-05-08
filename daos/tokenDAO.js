const Token = require('../models/token')
const uuid = require('uuid')

module.exports.makeTokenForUserId = async (userId) => {
    const token = uuid.v4();
    const created = await Token.create({ userId, token });
    return created.token
  }
  
  module.exports.getUserIdFromToken = async (tokenString) => {
    const tokenRecord = await Token.findOne({ token: tokenString }).lean();
    if (tokenRecord) {
      return tokenRecord.userId
    } else {
      return undefined
    }
  }