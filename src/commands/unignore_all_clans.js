module.exports = function (bot, args, channel, inDashboard) {
  bot.info.settings.IGNORED_CLANS = [];
  bot.saveInfo(bot);
  if (!inDashboard) channel.send('All clans removed from the Ignored Clans list.');
};