const donationSchema = require("../../Schemas/donationSchema");
const {
  EmbedBuilder,
  ApplicationCommandType,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  PermissionFlagsBits,
} = require("discord.js");
module.exports = {
  name: "statistics",
  description: "Check a user's donation statistics in a specific guild.",
  type: ApplicationCommandType.ChatInput,
  category: "Statistics",
  options: [
    {
      name: "user",
      description: "The user's statistics you are checking.",
      type: ApplicationCommandOptionType.User,
      required: false,
    },
  ],
  /**
   * @param {CommandInteraction} interaction
   */
  run: async (client, interaction, args) => {
    let statisticsInformation = {
      user: interaction.options.getUser("user") || interaction.user,
    };

    let donatingSchema;
    donatingSchema = await donationSchema.findOne({
      userID: statisticsInformation.user.id,
      guildID: interaction.guild.id,
    });
    if (!donatingSchema) {
      donatingSchema = new donationSchema({
        userID: statisticsInformation.user.id,
        guildID: interaction.guild.id,
      });
      await donatingSchema.save();
    }

    let donatorEmbed = new EmbedBuilder()
      .setDescription(
        `
Donation Statistics:
<:whiteDot:962849666674860142> **Giveaways:** ${donatingSchema.timesDonated.giveaway}
<:whiteDot:962849666674860142> **Events:** ${donatingSchema.timesDonated.event}
<:whiteDot:962849666674860142> **Heists:** ${donatingSchema.timesDonated.heist}`
      )
      .setColor("303136");

    let managerEmbed = new EmbedBuilder()
      .setDescription(
        `
Managing Statistics
<:whiteDot:962849666674860142> **Giveaways:** ${donatingSchema.timesAccepted.giveaway}
<:whiteDot:962849666674860142> **Events:** ${donatingSchema.timesAccepted.event}
<:whiteDot:962849666674860142> **Heists:** ${donatingSchema.timesAccepted.heist}`
      )
      .setColor("303136");

    let donatorRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setLabel("<<")
        .setCustomId("donatorleft")
        .setDisabled(),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setLabel(">>")
        .setCustomId("donatorright")
    );

    let managerRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setLabel("<<")
        .setCustomId("managerleft"),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setLabel(">>")
        .setCustomId("managerright")
        .setDisabled()
    );

    interaction.reply({
      embeds: [donatorEmbed],
      components: [donatorRow],
    });

    const filter = (i) => i.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      time: 15000,
    });
    collector.on("collect", async (i) => {
      if (i.customId === "donatorright") {
        await i.update({ embeds: [managerEmbed], components: [managerRow] });
      } else if (i.customId === "managerleft") {
        await i.update({ embeds: [donatorEmbed], components: [donatorRow] });
      }
    });

    let disabledRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setLabel("<<")
        .setCustomId("managerleft")
        .setDisabled(),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setLabel(">>")
        .setCustomId("managerright")
        .setDisabled()
    );

    collector.on("end", async (collected) => {
      if (!collected.size) {
        interaction.editReply({
          components: [disabledRow],
          fetchReply: true,
        });
      }
    });
  },
};
