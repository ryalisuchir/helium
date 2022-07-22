const Event = require("../../Structures/Classes/event");
const { version: discordjsVersion } = require("discord.js");
let ms = require("ms");
const chalk = require("chalk");
const {
  ButtonBuilder,
  ButtonStyle,
  Client,
  Interaction,
  ActionRowBuilder,
  Collection,
  EmbedBuilder,
} = require("discord.js");

module.exports = new Event("ready", async (client) => {
  client.user.setPresence({
    activities: [
      {
        name: `Krypto Dankers`,
        type: "WATCHING",
      },
    ],
    status: "dnd",
  });
});
