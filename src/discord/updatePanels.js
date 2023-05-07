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

function formatToFieldValues(embed, title, arr, inline) {
  if (arr.length === 0) return embed.addField(title, '• *None*', inline);

  let combinedStr = arr.sort().reduce((str, p, i) => str + `• *${p}*${i < arr.length - 1 ? '\n' : ''}`, '');
  const strArr = [];

  do {
    const section = combinedStr.substr(0, 1024);
    const lastEOL = section.lastIndexOf('\n');

    if (lastEOL !== -1) {
      if (section.length >= 2000) {
        strArr.push(section.substr(0, lastEOL));
      } else {
        strArr.push(section);
      }
    } else {
      strArr.push(section);
    }
    
    combinedStr = combinedStr.substr(lastEOL);
  } while (combinedStr.length > 1024);

  strArr.forEach((str, idx) => {
    let formattedStr = str.trim();
    if (formattedStr) {
      embed.addField(idx > 0 ? `${title} continued...` : title, formattedStr, inline);
    }
  });
}

function updateSettingsPanel(bot) {
  const embed = new RichEmbed();
  embed.setColor(0x99ff99)
  embed.setAuthor(`Bot Settings`, bot.config.DASHBOARD_ICONS.settings)
  embed.setFooter('Updated')
  embed.setTimestamp(new Date())

  formatToFieldValues(embed, 'Allied Players', bot.info.settings.ALLIED_PLAYERS)
  formatToFieldValues(embed, 'Ignored Players', bot.info.settings.IGNORED_PLAYERS, true)
  formatToFieldValues(embed, 'Ignored Clans', bot.info.settings.IGNORED_CLANS, true)
  formatToFieldValues(embed, 'Ignored Holdings', bot.info.settings.IGNORED_HOLDINGS, true)
  
  bot.panels.settings.edit(embed);
}

function updateUniquesPanel(bot) {
  const embed = new RichEmbed();
  embed.setColor(0x6699ff)
  embed.setAuthor(`Unique Players`, bot.config.DASHBOARD_ICONS.uniques)
  formatToFieldValues(embed, 'Allies', bot.info.uniques.UNIQUE_ALLIES, true)
  formatToFieldValues(embed, 'Enemies', bot.info.uniques.UNIQUE_ENEMIES, true)
  embed.setFooter('Updated')
  embed.setTimestamp(new Date())

  bot.panels.uniques.edit(embed);
}

function updateHoldingsPanel(bot) {
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

  bot.panels.holdings.edit(embed);
}

module.exports = async function (bot) {
  await updateSettingsPanel(bot);
  // await updateUniquesPanel(bot);
  await updateHoldingsPanel(bot);
}