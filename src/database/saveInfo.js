const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const { InfoModel } = require('./models');

module.exports = async function (bot) {
  bot.updatePanels(bot);
  return InfoModel.findOneAndUpdate({}, bot.info, { upsert: true, setDefaultsOnInsert: true, new: true }, (err) => {
    if (err) console.log(err);
  });
}