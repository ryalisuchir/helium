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
  client.on("debug", console.log).on("warn", console.log);
  client.user.setPresence({
    activities: [
      {
        name: `Stormy Bay`,
        type: "WATCHING",
      },
    ],
    status: "dnd",
  });
});
