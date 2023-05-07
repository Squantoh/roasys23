const { RichEmbed } = require('discord.js');

async function initSettingsPanel(bot) {
  let embed = new RichEmbed()
    .setColor(0x99ff99)
    .setAuthor(`Bot Settings`, bot.config.DASHBOARD_ICONS.settings)
    .setDescription('Loading...');

  try {
    bot.panels.settings = await bot.liveDashboard.fetchMessage(bot.info.settings.SETTINGS_PANEL_ID);
    bot.panels.settings.edit(embed);
  } catch (e) {
    bot.panels.settings = await bot.liveDashboard.send(embed);
    bot.info.settings.SETTINGS_PANEL_ID = bot.panels.settings.id;
    bot.saveInfo(bot);
  }
}

async function initUniquesPanel(bot) {
  let embed = new RichEmbed()
    .setColor(0x6699ff)
    .setAuthor(`Unique Players`, bot.config.DASHBOARD_ICONS.uniques)
    .setDescription('Loading...');

  try {
    bot.panels.uniques = await bot.liveDashboard.fetchMessage(bot.info.settings.UNIQUES_PANEL_ID);
    bot.panels.uniques.edit(embed);
  } catch (e) {
    bot.panels.uniques = await bot.liveDashboard.send(embed);
    bot.info.settings.UNIQUES_PANEL_ID = bot.panels.uniques.id;
    bot.saveInfo(bot);
  }
}

async function initHoldingsPanel(bot) {
  let embed = new RichEmbed()
    .setColor(0xff9966)
    .setAuthor(`Clan Holdings`, bot.config.DASHBOARD_ICONS.holdings)
    .setDescription('Loading...');

  try {
    bot.panels.holdings = await bot.liveDashboard.fetchMessage(bot.info.settings.HOLDINGS_PANEL_ID);
    bot.panels.holdings.edit(embed);
  } catch (e) {
    bot.panels.holdings = await bot.liveDashboard.send(embed);
    bot.info.settings.HOLDINGS_PANEL_ID = bot.panels.holdings.id;
    bot.saveInfo(bot);
  }
}

module.exports = async function (bot) {
  await initSettingsPanel(bot);
  // await initUniquesPanel(bot);
  await initHoldingsPanel(bot);
}