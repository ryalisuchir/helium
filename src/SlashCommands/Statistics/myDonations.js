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
  name: "donations",
  description: "Check a user's donations in a specified guild.",
  type: ApplicationCommandType.ChatInput,
  category: "User_Specific",
  options: [
    {
      name: "type",
      description: "Donations from guild or 1K event?",
      type: ApplicationCommandOptionType.String,
      autocomplete: true,
      required: true,
    },
    {
      name: "user",
      description: "The user for which you are checking donations.",
      type: ApplicationCommandOptionType.User,
      required: false,
    },
  ],
  /**
   * @param {CommandInteraction} interaction
   */
  run: async (client, interaction, args) => {
    let eventDonation = {
      type: interaction.options.getString("type"),
      user: interaction.options.getUser("user") || interaction.user,
    };

    let dSchema;
    dSchema = await donationSchema.findOne({
      userID: eventDonation.user.id,
      guildID: interaction.guild.id,
    });
    if (!dSchema) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              "This user does not have any donations in the server."
            )
            .setColor("303136"),
        ],
        ephemeral: true,
      });
    }

    if (eventDonation.type !== "1k event" && eventDonation.type !== "normal") {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription("Please select from the options.")
            .setColor("303136"),
        ],
        ephemeral: true,
      });
    }

    if (eventDonation.type === "normal") {
      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `
${eventDonation.user}'s contributions in ${interaction.guild.name}:
<:whiteDot:962849666674860142> **Event Donations:** ⏣ ${dSchema.donations.event.toLocaleString()}
<:whiteDot:962849666674860142> **Giveaway Donations:** ⏣ ${dSchema.donations.giveaway.toLocaleString()}
<:whiteDot:962849666674860142> **Heist Donations:** ⏣ ${dSchema.donations.heist.toLocaleString()}

\` - \` **Total Donations:** ⏣ ${Math.round(
                dSchema.donations.event +
                  dSchema.donations.giveaway +
                  dSchema.donations.heist
              ).toLocaleString()}`
            )
            .setColor("303136"),
        ],
      });
    } else {
      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `
${eventDonation.user}'s contributions to the 1K event in ${
                interaction.guild.name
              }:
<:whiteDot:962849666674860142> **Event Donations:** ⏣ ${dSchema.onethousand.event.toLocaleString()}
<:whiteDot:962849666674860142> **Giveaway Donations:** ⏣ ${dSchema.onethousand.giveaway.toLocaleString()}
<:whiteDot:962849666674860142> **Heist Donations:** ⏣ ${dSchema.onethousand.heist.toLocaleString()}

\` - \` **Total Donations:** ⏣ ${Math.round(
                dSchema.onethousand.event +
                  dSchema.onethousand.giveaway +
                  dSchema.onethousand.heist
              ).toLocaleString()}`
            )
            .setColor("303136"),
        ],
      });
    }
  },
};
