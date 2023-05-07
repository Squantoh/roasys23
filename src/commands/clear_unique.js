module.exports = function (bot, args, channel, inDashboard) {
  bot.info.uniques.UNIQUE_ENEMIES = [];
  bot.info.uniques.UNIQUE_ALLIES = [];
  bot.saveInfo(bot);
  if (!inDashboard) channel.send('Unique players cleared!');
};