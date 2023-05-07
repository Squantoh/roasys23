const mongoose = require('mongoose');

const uniquesSchema = mongoose.Schema({
  UNIQUE_ALLIES: { type: [String], default: [] },
  UNIQUE_ENEMIES: { type: [String], default: [] },
});

const settingsSchema = mongoose.Schema({
  ALLIED_PLAYERS: { type: [String], default: [] },
  IGNORED_PLAYERS: { type: [String], default: [] },
  IGNORED_CLANS: { type: [String], default: [] },
  IGNORED_HOLDINGS: { type: [String], default: [] },
  SETTINGS_PANEL_ID: { type: String, default: '' },
  HOLDINGS_PANEL_ID: { type: String, default: '' },
  UNIQUES_PANEL_ID: { type: String, default: '' },
});

const infoSchema = mongoose.Schema({
  uniques: uniquesSchema,
  settings: settingsSchema,
  holdings: { type: {}, default: {} },
});

const entrySchema = mongoose.Schema({
  rank: String,
  city: String,
  clan: String,
  username: String,
  timeStamp: String,
  ourClan: Boolean,
  inCity: Boolean,
});

const InfoModel = mongoose.model('info', infoSchema);
const EntriesModel = mongoose.model('entries', entrySchema);

module.exports = { InfoModel, EntriesModel };
