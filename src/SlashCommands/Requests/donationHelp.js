const overallSchema = require("../../Schemas/guildConfigurationSchema");
const donationSchema = require("../../Schemas/donationSchema");
const wait = require("node:timers/promises").setTimeout;
const {
  EmbedBuilder,
  ApplicationCommandType,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  PermissionFlagsBits,
} = require("discord.js");
const ms = require("ms");

module.exports = {
  name: "donationhelp",
  description: "The help embeds for requests in a guild.",
  type: ApplicationCommandType.ChatInput,
  category: "Requests",
  options: [
    {
      name: "event",
      description: "The help embed for events.",
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
      name: "giveaway",
      description: "The help embed for giveaways.",
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
      name: "heist",
      description: "The help embed for heists.",
      type: ApplicationCommandOptionType.Subcommand,
    },
  ],
  /**
   * @param {CommandInteraction} interaction
   */

  run: async (client, interaction, args) => {
    let serverProfile;
    try {
      serverProfile = await overallSchema.findOne({
        guildID: interaction.guild.id,
      });
    } catch (err) {
      console.log(err);
    }

    if (interaction.options.getSubcommand() === "event") {
      if (!serverProfile.eventsManager || !serverProfile.eventsPing) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                "This guild has not set up roles for events managers and/or events pings."
              )
              .setColor("303136"),
          ],
          ephemeral: true,
        });
      }
      let managerID = serverProfile.eventsManager.slice(3, -1);
      if (
        !interaction.member.roles.cache.has(managerID) &&
        !interaction.member.permissions.has([PermissionFlagsBits.Administrator])
      ) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                "You need permission to use the help command for donations in this guild."
              )
              .setColor("303136"),
          ],
          ephemeral: true,
        });
      }
      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Donating to events in " + interaction.guild.name + ":")
            .setDescription(
              `Please donate for events using the following format:
<:slash:980152110127669279> eventdonate <event> <amount> <message>

**All event donations must exceed one million in total.**`
            )
            .setFooter({ text: "Thank you for donating..." })
            .setColor("303136"),
        ],
      });
    }

    if (interaction.options.getSubcommand() === "giveaway") {
      if (!serverProfile.giveawayManager || !serverProfile.giveawayPing) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                "This guild has not set up roles for giveaway managers and/or giveaway pings."
              )
              .setColor("303136"),
          ],
          ephemeral: true,
        });
      }
      let managerID = serverProfile.giveawayManager.slice(3, -1);
      if (
        !interaction.member.roles.cache.has(managerID) &&
        !interaction.member.permissions.has([PermissionFlagsBits.Administrator])
      ) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                "You need permission to use the help command for donations in this guild."
              )
              .setColor("303136"),
          ],
          ephemeral: true,
        });
      }
      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle(
              "Donating to giveaways in " + interaction.guild.name + ":"
            )
            .setDescription(
              `Please donate for giveaways using the following format:
<:slash:980152110127669279> giveawaydonate <time> <winners> <prize> <message> <requirements>

**All giveaway donations must exceed one million in total.**`
            )
            .setFooter({ text: "Thank you for donating..." })
            .setColor("303136"),
        ],
      });
    }

    if (interaction.options.getSubcommand() === "heist") {
      if (!serverProfile.heistManager || !serverProfile.heistPing) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                "This guild has not set up roles for heist managers and/or heist pings."
              )
              .setColor("303136"),
          ],
          ephemeral: true,
        });
      }
      let managerID = serverProfile.heistManager.slice(3, -1);
      if (
        !interaction.member.roles.cache.has(managerID) &&
        !interaction.member.permissions.has([PermissionFlagsBits.Administrator])
      ) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                "You need permission to use the help command for donations in this guild."
              )
              .setColor("303136"),
          ],
          ephemeral: true,
        });
      }
      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Donating to heists in " + interaction.guild.name + ":")
            .setDescription(
              `Please donate for heists using the following format:
<:slash:980152110127669279> heistdonate <amount> <message>

Please specify the bot in which you are donating, in the donation channel.`
            )
            .setFooter({ text: "Thank you for donating..." })
            .setColor("303136"),
        ],
      });
    }
  },
};
