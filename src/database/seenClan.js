const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const { EntriesModel } = require('./models');

module.exports = async function (clan) {
  let clanRegex = `^${clan}$`;
  return EntriesModel.findOne({"clan": { $regex : new RegExp(clanRegex, "i")}}, null, {sort: {timeStamp: -1}}, (err, result) => {
    if (err) console.log(err);
    return result;
  });
}