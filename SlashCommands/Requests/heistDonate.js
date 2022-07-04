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
  name: "heistdonate",
  description: "Donate for a heist in a specified guild.",
  type: ApplicationCommandType.ChatInput,
  category: "Requests",
  options: [
    {
      name: "amount",
      description: "The amount you are donating.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "message",
      description: "Any message for your heist.",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],
  /**
   * @param {CommandInteraction} interaction
   */

  run: async (client, interaction, args) => {
    let heistInformation = {
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
    if (donationProfile.pendingDonations.heist) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              "It appears that you have an pending heist donation in this guild already."
            )
            .setColor("303136"),
        ],
        ephemeral: true,
      });
    }

    donationProfile.pendingDonations.heist = true;
    await donationProfile.save();

    let serverProfile;
    try {
      serverProfile = await overallSchema.findOne({
        guildID: interaction.guild.id,
      });
    } catch (err) {
      console.log(err);
    }
    if (!serverProfile || !serverProfile.heistManager)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `This guild has not setup heist managers. Please use the following commands:
<:slash:980152110127669279> setmanager <heist> <role>`
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
      content: `${serverProfile.heistManager}`,
    });
    interaction.channel.send({
      embeds: [
        new EmbedBuilder()
          .setDescription(
            `${interaction.user}, thank you for donating.
**Amount:** ${heistInformation.amount}
**Message:** ${heistInformation.message}`
          )
          .setFooter({
            text: "A heist manager will accept your donation shortly.",
          })
          .setColor("303136"),
      ],
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setCustomId(
              `accept-heist-${ahhs.id}-${interaction.user.id}-${interaction.channel.id}`
            )
            .setLabel("Accept")
        ),
      ],
    });
  },
};
