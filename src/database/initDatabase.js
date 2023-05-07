const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const { InfoModel, EntriesModel} = require('./models');

module.exports = async function (bot) {
  EntriesModel.findOneAndUpdate({}, {}, { upsert: true }, (err) => {});
  return await InfoModel.findOneAndUpdate({}, {}, { upsert: true, setDefaultsOnInsert: true, new: true }, async (err, result) => {
    if (err) console.log(err);
    return await result;
  });
}