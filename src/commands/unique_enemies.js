const { RichEmbed } = require('discord.js');

function formatToFieldValues(arr) {
  if (arr.length === 0) return '• *None*'
  return arr.sort().reduce((str, p, i) => str + `• *${p}*${i < arr.length - 1 ? '\n' : ''}`, '');
}

module.exports = function (bot, args, channel, inDashboard) {
  if (inDashboard) return;

  channel.send(new RichEmbed()
    .setColor(0x6699ff)
    .setAuthor(`Unique Players`, bot.config.DASHBOARD_ICONS.uniques)
    .addField('Enemies', formatToFieldValues(bot.info.uniques.UNIQUE_ENEMIES), true)
  );
};