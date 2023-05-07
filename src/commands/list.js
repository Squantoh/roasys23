const { RichEmbed } = require('discord.js');

function formatToFieldValues(arr) {
  if (arr.length === 0) return '• *None*'
  return arr.sort().reduce((str, p, i) => str + `• *${p}*${i < arr.length - 1 ? '\n' : ''}`, '');
}

module.exports = function (bot, args, channel, inDashboard) {
  if (inDashboard) return;

  channel.send(new RichEmbed()
    .setColor(0x99ff99)
    .setAuthor(`Bot Settings`, bot.config.DASHBOARD_ICONS.settings)
    .addField('Allied Players', formatToFieldValues(bot.info.settings.ALLIED_PLAYERS))
    .addField('Ignored Players', formatToFieldValues(bot.info.settings.IGNORED_PLAYERS), true)
    .addField('Ignored Clans', formatToFieldValues(bot.info.settings.IGNORED_CLANS), true)
    .addField('Ignored Holdings', formatToFieldValues(bot.info.settings.IGNORED_HOLDINGS), true)
  );
};