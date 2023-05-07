module.exports = function (bot, args, channel, inDashboard) {
  if (!args.length) {
    if (!inDashboard)
      channel.send(`Please provide an argument.`);
    return;
  }

  let validArgs = [], invalidArgs = [];
  let lcSettingsArr = bot.info.settings.ALLIED_PLAYERS.map((e) => e.toLowerCase());

  for (let i = 0; i < args.length; i++) {
    if (lcSettingsArr.indexOf(args[i].toLowerCase()) === -1) {
      bot.info.settings.ALLIED_PLAYERS.push(args[i]);
      validArgs.push(args[i]);
    } else {
      invalidArgs.push(args[i]);
    }
  }

  if (validArgs.length) if (!inDashboard) channel.send(`\`${validArgs.join(', ')}\` added to the Allied Players list.`);
  if (invalidArgs.length) if (!inDashboard) channel.send(`\`${invalidArgs.join(', ')}\` already in the Allied Players list.`);

  bot.saveInfo(bot);
}