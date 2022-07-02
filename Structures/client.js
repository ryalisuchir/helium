const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
} = require("discord.js");
const { colors } = require("./Configuration/colors");
const { config } = require("./Configuration/configuration");
const Command = require("./Classes/command");
const SlashCommand = require("./Classes/slashCommand");
const ContextCommand = require("./Classes/contextCommand");
const utilityFunction = require("./utility");
const utils = require("./Functions/utility");

class ExtendedClient extends Client {
  commands = new Collection();
  aliases = new Collection();
  slashCommands = new Collection();
  snipes = {};
  editSnipes = {};
  reactionSnipes = {};
  config = config;
  colors = colors;
  util = new utils();
  constructor() {
    super({
      intents: 32767,
      partials: [Partials.Channel, Partials.Message, Partials.Reaction],
    });
    this.utils = new utilityFunction(this);
  }
  start() {
    this.utils.startClient();
  }
}

module.exports = ExtendedClient;
