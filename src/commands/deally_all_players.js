module.exports = function (bot, args, channel, inDashboard) {
  bot.info.settings.ALLIED_PLAYERS = [];
  bot.saveInfo(bot);
  if (!inDashboard) channel.send('All players removed from the Allied Players list.');
};