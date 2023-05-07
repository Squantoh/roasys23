const seenPlayer = require('../database/seenPlayer');

module.exports = async function (bot, args, channel, inDashboard) {
  if (inDashboard) return;
  if (!args.length) return channel.send(`Please provide an argument.`);

  let entry = await seenPlayer(args[0]);
  if (entry) channel.send(`${entry.rank} ${entry.username} ${entry.clan ? `of clan "${entry.clan}"` : ''} was last seen ${entry.inCity ? 'entering' : 'leaving'} "${entry.city}" on ${entry.timeStamp}.`);
  else channel.send(`No entry data on \`${args[0]}\`.`);
};