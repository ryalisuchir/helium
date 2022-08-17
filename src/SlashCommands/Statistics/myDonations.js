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


      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `
${eventDonation.user}'s contributions in ${interaction.guild.name}:
<:whiteDot:962849666674860142> **Event Donations:** ⏣ ${dSchema.donations.event.toLocaleString()}
<:whiteDot:962849666674860142> **Giveaway Donations:** ⏣ ${dSchema.donations.giveaway.toLocaleString()}
<:whiteDot:962849666674860142> **Heist Donations:** ⏣ ${dSchema.donations.heist.toLocaleString()}
<:whiteDot:962849666674860142> **Grinder Donations:** ⏣ ${dSchema.grinderDonations.totalGrinder.toLocaleString()}

\` - \` **Total Donations:** ⏣ ${Math.round(
                dSchema.donations.event +
                  dSchema.donations.giveaway +
                  dSchema.donations.heist + dSchema.grinderDonations.totalGrinder
              ).toLocaleString()}`
            )
            .setColor("303136"),
        ],
      });

  },
};
