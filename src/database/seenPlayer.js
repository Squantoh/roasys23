const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const { EntriesModel } = require('./models');

module.exports = async function (username) {
  let usernameRegex = `^${username}$`;
  return EntriesModel.findOne({"username": { $regex : new RegExp(usernameRegex, "i")}}, null, {sort: {timeStamp: -1}}, async (err, result) => {
    if (err) console.log(err);
    return result;
  });
}