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
  name: "giveawaydonate",
  description: "Donate for a giveaway in a specified guild.",
  type: ApplicationCommandType.ChatInput,
  category: "Requests",
  options: [
    {
      name: "time",
      description: "The amount of time the giveaway is being held for.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "winners",
      description: "The amount of winners for the specific giveaway.",
      type: ApplicationCommandOptionType.Integer,
      required: true,
    },
    {
      name: "prize",
      description: "Whatever you are donating.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "message",
      description: "Any message for your giveaway.",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
    {
      name: "requirements",
      description: "The requirements to join a certain giveaway.",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],
  /**
   * @param {CommandInteraction} interaction
   */

  run: async (client, interaction, args) => {
    let giveawayInformation = {
      time: interaction.options.getString("time"),
      winners: interaction.options.getInteger("winners"),
      requirements: interaction.options.getString("requirements") || "Not specified.",
      prize: interaction.options.getString("prize"),
			message: interaction.options.getString("message") || "Not specified.",
    };

    let donationProfile;
    donationProfile = await donationSchema.findOne({
      userID: interaction.user.id,
      guildID: interaction.guild.id,
    });
    if (!donationProfile) {
      donationProfile = new donationSchema({
        userID: interaction.user.id,
        guildID: interaction.guild.id,
      });
    }
    if (donationProfile.pendingDonations.giveaway) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              "It appears that you have an pending giveaway donation in this guild already."
            )
            .setColor("303136"),
        ],
        ephemeral: true,
      });
    }

    donationProfile.pendingDonations.giveaway = true;
    await donationProfile.save();

    let serverProfile;
    try {
      serverProfile = await overallSchema.findOne({
        guildID: interaction.guild.id,
      });
    } catch (err) {
      console.log(err);
    }
    if (!serverProfile || !serverProfile.giveawayManager)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `This guild has not setup giveaway managers. Please use the following commands:
<:slash:980152110127669279> setmanager <giveaway> <role>`
            )
            .setColor("303136"),
        ],
      });
    interaction.reply({
      content: `Your request went through <t:${Math.round(
        Date.now() / 1000
      )}:R>.`,
      ephemeral: true,
    });
    let ahhs = await interaction.channel.send({
      content: `${serverProfile.giveawayManager}`,
    });
    interaction.channel.send({
      embeds: [
        new EmbedBuilder()
          .setDescription(
            `${interaction.user}, thank you for donating.
**Prize:** ${giveawayInformation.prize}
**Message:** ${giveawayInformation.message}
**Winners:** ${giveawayInformation.winners}
**Requirements:** ${giveawayInformation.requirements}
**Time:** ${giveawayInformation.time}`
          )
          .setFooter({
            text: "A giveaway manager will accept your donation shortly.",
          })
          .setColor("303136"),
      ],
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setCustomId(
              `accept-giveaway-${ahhs.id}-${interaction.user.id}-${interaction.channel.id}`
            )
            .setLabel("Accept")
        ),
      ],
    });
  },
};
