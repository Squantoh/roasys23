module.exports = function (bot, args, channel, inDashboard) {
  bot.info.settings.IGNORED_PLAYERS = [];
  bot.saveInfo(bot);
  if (!inDashboard) channel.send('All players removed from the Ignored Players list.');
};