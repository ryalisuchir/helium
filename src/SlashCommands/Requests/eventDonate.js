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
  name: "eventdonate",
  description: "Donate for an event in a specified guild.",
  type: ApplicationCommandType.ChatInput,
  category: "Requests",
  options: [
    {
      name: "event",
      description: "The event you are donating for.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "amount",
      description: "What you are donating - specify which bot.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "message",
      description: "A message for your donation.",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],
  /**
   * @param {CommandInteraction} interaction
   */

  run: async (client, interaction, args) => {
    let eventInformation = {
      event: interaction.options.getString("event"),
      amount: interaction.options.getString("amount"),
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
    if (donationProfile.pendingDonations.event) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              "It appears that you have an pending event donation in this guild already."
            )
            .setColor("303136"),
        ],
        ephemeral: true,
      });
    }

    donationProfile.pendingDonations.event = true;
    await donationProfile.save();

    let serverProfile;
    try {
      serverProfile = await overallSchema.findOne({
        guildID: interaction.guild.id,
      });
    } catch (err) {
      console.log(err);
    }
    if (!serverProfile || !serverProfile.eventsManager)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `This guild has not setup events managers. Please use the following commands:
<:slash:980152110127669279> setmanager <events> <role>`
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
      content: `${serverProfile.eventsManager}`,
    });
    interaction.channel.send({
      embeds: [
        new EmbedBuilder()
          .setDescription(
            `${interaction.user}, thank you for donating.
**Event:** ${eventInformation.event}
**Amount:** ${eventInformation.amount}
**Message:** ${eventInformation.message}`
          )
          .setFooter({
            text: "An events manager will accept your donation shortly.",
          })
          .setColor("303136"),
      ],
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setCustomId(
              `accept-event-${ahhs.id}-${interaction.user.id}-${interaction.channel.id}`
            )
            .setLabel("Accept")
        ),
      ],
    });
  },
};
