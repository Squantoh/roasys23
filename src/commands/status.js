const { RichEmbed } = require('discord.js');

function formatHoldingInfo(holding, bot) {
  let clans = Object.keys(holding);
  if (clans.length === 0) return '• *None*';

  let lcIgnoredClans = bot.info.settings.IGNORED_CLANS.map(ele => ele.toLowerCase());
  let lcIgnoredPlayers = bot.info.settings.IGNORED_PLAYERS.map(ele => ele.toLowerCase());

  let clanList = '';
  for (let idx = 0; idx < clans.length; idx++) {
    let clanArr = holding[clans[idx]];
    // remove ignored players from the clan list
    clanArr = clanArr.filter((ele) => lcIgnoredPlayers.indexOf(ele.toLowerCase()) === -1);
    // if clan is not ignored, then create a str of the clan name + active clan members
    if (lcIgnoredClans.indexOf(clans[idx].toLowerCase()) === -1)
      if (clanArr.length)
        clanList += clanArr.sort().reduce((str, p, i) => str + `• *${p}*${(i === clanArr.length - 1) ? (idx === clans.length - 1 ? '' : '\n\n') : '\n'}`, `__${clans[idx]}: ${clanArr.length}__\n`);
  }

  return clanList;
}

module.exports = function (bot, args, channel, inDashboard) {
  if (inDashboard) return;

  const embed = new RichEmbed()
    .setColor(0xff9966)
    .setAuthor(`Clan Holdings`, bot.config.DASHBOARD_ICONS.holdings)
    .setFooter('Updated')
    .setTimestamp(new Date())

  if (!Object.keys(bot.info.holdings).length) {
    embed.setDescription(`• *None*`);
  }

  let lcIgnoredHoldings = bot.info.settings.IGNORED_HOLDINGS.map(ele => ele.toLowerCase());

  for (let ele in bot.info.holdings)
    if (lcIgnoredHoldings.indexOf(ele.toLowerCase()) === -1)
      embed.addField(`══ ${ele} ══`, formatHoldingInfo(bot.info.holdings[ele], bot) || '• *None*', true);

  channel.send(embed);
};