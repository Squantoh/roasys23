require('dotenv').config()

const fs = require('fs');
const { Client } = require('discord.js');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const getProximityEntries = require('./discord/getProximityEntries');
const initPanels = require('./discord/initPanels');
const updatePanels = require('./discord/updatePanels');
const initDatabase = require('./database/initDatabase');
const saveInfo = require('./database/saveInfo');

class Proxitar {
  constructor(config) {
    this.client = new Client();
    this.config = config;
    this.liveDashboard, this.holdings, this.guild;
    this.updatePanels = updatePanels;
    this.saveInfo = saveInfo;
    this.info = {};
    this.panels = { settings: null, holdings: null, uniques: null };
  }

  async ready() {
    console.log(`Logged in as ${this.client.user.tag}!`);
    this.guild = this.client.guilds.get(this.config.GUILD_ID);
    this.liveDashboard = this.guild.channels.get(this.config.LIVEDASHBOARD_CHANNEL_ID);

    await initPanels(this);
    this.updatePanels(this);
    getProximityEntries(this);

    setInterval(() => {
      getProximityEntries(this);
    }, 30000);
  }

  async message(m) {
    if (m.author.bot) return;

    const channel = m.channel;
    const inDashboard = channel.id === this.config.LIVEDASHBOARD_CHANNEL_ID;
    const prefix = m.content.substring(0, this.config.COMMAND_PREFIX.length);
    const matchPrefix = prefix === this.config.COMMAND_PREFIX;
    let args = m.content.split(' ');

    if (inDashboard) m.delete(1000);
    if (!matchPrefix && !(/^(\<:).*\>$/.test(args[0]))) return;
    if (!m.member.roles.some((r) => r.id === this.config.COMMAND_ROLE_ID)) if (!inDashboard) return channel.send("You don't permission to run commands!");
    if (m.channel.parentID !== this.config.COMMAND_CATEGORY_ID) return;

    let rawCommand = args.shift();
    if (args.length)
      args = args.join(' ').split(/[,]+/).map(e => e.trim());
    let command = matchPrefix ? rawCommand.substring(this.config.COMMAND_PREFIX.length).toLowerCase() : rawCommand.substring(2, rawCommand.indexOf(':', 3)).toLowerCase();

    if (fs.existsSync(`${__dirname}/commands/${command}.js`))
      require(`./commands/${command}`)(this, args, channel, inDashboard);
  }

  async init() {
    mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
    this.info = await initDatabase(this);
    this.client.login(process.env.TOKEN);
    this.client
      .on('ready', () => this.ready())
      .on('message', (m) => this.message(m))
  }
}

let rawdata = fs.readFileSync('config.json');
let config = JSON.parse(rawdata);
new Proxitar(config).init();

process.on('unhandledRejection', (r, p) => console.error('Unhandled Rejection at:', p));
