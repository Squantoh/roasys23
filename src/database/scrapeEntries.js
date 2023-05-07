const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const { InfoModel, EntriesModel } = require('./models');

exports.gotoNextPage = async function (entries) {
  const entry = entries[entries.length - 1];

  const found = await EntriesModel.findOne({
    rank: entry.rank,
    city: entry.city,
    clan: entry.clan,
    username: entry.username,
    timeStamp: entry.timeStamp,
    ourClan: entry.ourClan,
    inCity: entry.inCity,
  })

  if (found) return false;
  return true;
}

exports.insertEntries = async function (entries, bot) {
  // update Holdings
  for (let i = entries.length - 1; i >= 0; i--) {
    let entry = entries[i];
    let lcCity = entry.city.toLowerCase();
    // does the city exist already, case insensitive
    if (!Object.keys(bot.info.holdings).some((holding) => holding.toLowerCase() === lcCity)) bot.info.holdings[entry.city] = {};

    let lcClan = entry.clan ? entry.clan.toLowerCase() : entry.clan;
    // does the clan exist already, case insensitive
    if (!Object.keys(bot.info.holdings[entry.city]).some((clan) => clan.toLowerCase() === lcClan)) bot.info.holdings[entry.city][entry.clan] = [];

    // update unique if not in our clan
    if (!entry.ourClan) {
      let lcUsername = entry.username.toLowerCase();
      // if entry is an allied player
      if (bot.info.settings.ALLIED_PLAYERS.length && bot.info.settings.ALLIED_PLAYERS.some((user) => user.toLowerCase() === lcUsername)) {
        // if entry is not already on UNIQUE_ALLIES
        if (!bot.info.uniques.UNIQUE_ALLIES.length || !bot.info.uniques.UNIQUE_ALLIES.some((user) => user.toLowerCase() === lcUsername)) 
          bot.info.uniques.UNIQUE_ALLIES.push(entry.username)
      } else {
        // if entry is not already on UNIQUE_ENEMIES
        if (!bot.info.uniques.UNIQUE_ENEMIES.some((user) => user.toLowerCase() === lcUsername)) 
          bot.info.uniques.UNIQUE_ENEMIES.push(entry.username)
      }
    }

    if (entry.inCity) {
      if (bot.info.holdings[entry.city][entry.clan].indexOf(entry.username) === -1)
        bot.info.holdings[entry.city][entry.clan].push(entry.username);
    } else {
      let index = bot.info.holdings[entry.city][entry.clan].indexOf(entry.username);
      if (index !== -1) {
        bot.info.holdings[entry.city][entry.clan].splice(index, 1);
        // delete all empty clans
        if (!bot.info.holdings[entry.city][entry.clan].length)
          delete bot.info.holdings[entry.city][entry.clan];
      }
    };
  }

  for (let i = entries.length - 1; i >= 0; i--) {
    const found = await EntriesModel.findOne({
      rank: entries[i].rank,
      city: entries[i].city,
      clan: entries[i].clan,
      username: entries[i].username,
      timeStamp: entries[i].timeStamp,
      ourClan: entries[i].ourClan,
      inCity: entries[i].inCity,
    })

    if (found) {
      entries.pop();
    } else {
      break;
    }
  }

  console.log('New entries to insert:', entries.length);

  bot.saveInfo(bot);

  if (entries.length) {
    const result = await EntriesModel.insertMany(entries);
  }
}