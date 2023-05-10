const uuid = require('uuid')
const User = require('../models/user')

module.exports = {};

module.exports.createUser = async (userObj, userEmail) => {
    const exist = await User.findOne({ email: userEmail }).lean();
    if (exist) {
      return 'exists'
    }
    const created = await User.create(userObj);
    return created;
}

module.exports.getUser = async (userEmail) => { 
    const user = await User.findOne({ email: userEmail }).lean(); //User.findOne() is model.function()
    return user;
}

module.exports.updateUserPassword = async (userId, password) => { 
    await User.updateOne({ _id: userId }, { password: password });
    return true
}