const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
} = require("discord.js");
const Command = require("./Classes/command");
const SlashCommand = require("./Classes/slashCommand");
const ContextCommand = require("./Classes/contextCommand");
const utilityFunction = require("./utility");
const utils = require("./Functions/utility");

class ExtendedClient extends Client {
  commands = new Collection();
  aliases = new Collection();
  slashCommands = new Collection();
  prefix = "krypto ";
  util = new utils();
  constructor() {
    super({
      intents: 3276543,
      partials: [Partials.Channel, Partials.Message, Partials.Reaction],
    });
    this.utils = new utilityFunction(this);
  }
  start() {
    this.utils.startClient();
  }
}

module.exports = ExtendedClient;
