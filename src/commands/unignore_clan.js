module.exports = function (bot, args, channel, inDashboard) {
  if (!args.length) {
    if (!inDashboard)
      channel.send(`Please provide an argument.`);
    return;
  }

  let validArgs = [], invalidArgs = [];
  let lcSettingsArr = bot.info.settings.IGNORED_CLANS.map((e) => e.toLowerCase());

  for (let i = 0; i < args.length; i++) {
    let index = lcSettingsArr.indexOf(args[i].toLowerCase());
    if (index !== -1) {
      bot.info.settings.IGNORED_CLANS.splice(index, 1);
      lcSettingsArr.splice(index, 1);
      validArgs.push(args[i]);
    } else {
      invalidArgs.push(args[i]);
    }
  }

  if (validArgs.length) if (!inDashboard) channel.send(`\`${validArgs.join(', ')}\` removed from the Ignored Clans list.`);
  if (invalidArgs.length) if (!inDashboard) channel.send(`\`${invalidArgs.join(', ')}\` not found in the Ignored Clans list.`);

  bot.saveInfo(bot);
};