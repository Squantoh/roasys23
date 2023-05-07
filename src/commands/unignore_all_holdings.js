module.exports = function (bot, args, channel, inDashboard) {
  IGNORED_HOLDINGS = [];
  bot.info.settings.IGNORED_HOLDINGS = [];
  bot.saveInfo(bot);
  if (!inDashboard) channel.send('All holdings removed from the Ignored Holdings list.');
};