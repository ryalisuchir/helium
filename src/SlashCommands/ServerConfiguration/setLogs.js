const overallSchema = require("../../Schemas/guildConfigurationSchema");
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
  name: "setlogs",
  description: "Set donation logs for a specific guild.",
  type: ApplicationCommandType.ChatInput,
  category: "ServerConfiguration",
  options: [
    {
      name: "channel",
      description: "The channel to setup logs.",
      type: ApplicationCommandOptionType.Channel,
      required: true,
    },
  ],
  /**
   * @param {CommandInteraction} interaction
   */
  run: async (client, interaction, args) => {
    const data = {
      channel: interaction.options.getChannel("channel"),
    };

    let guildSchema;
    guildSchema = await overallSchema.findOne({
      guildID: interaction.guild.id,
    });
    if (!guildSchema) {
      guildSchema = new overallSchema({
        guildID: interaction.guild.id,
      });
    }

    if (guildSchema.donationLogs) {
      let previousChannel = interaction.guild.channels.cache.get(
        guildSchema.donationLogs
      );

      if (previousChannel) {
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `There exists a donation logs channel for this guild already, in <#${guildSchema.donationLogs}>.

Confirm you would like to switch this channel to ${data.channel}.`
              )
              .setColor("303136"),
          ],
          components: [
            new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setStyle(ButtonStyle.Secondary)
                .setCustomId("confirm")
                .setLabel("Confirm"),
              new ButtonBuilder()
                .setStyle(ButtonStyle.Secondary)
                .setCustomId("deny")
                .setLabel("Deny")
            ),
          ],
        });
      } else {
        guildSchema.donationLogs = data.channel.id;
        await guildSchema.save();
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `Previously, there was an invalid channel ID setup for donation logs. It has now been changed to ${data.channel}.`
              )
              .setColor("303136"),
          ],
        });
      }
    } else {
      guildSchema.donationLogs = data.channel.id;
      await guildSchema.save();
      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `Successfully set the donation logs in this guild to ${data.channel}.`
            )
            .setColor("303136"),
        ],
      });
    }

    const filter = (i) => i.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      time: 15000,
    });
    collector.on("collect", async (i) => {
      let disabledRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setStyle(ButtonStyle.Secondary)
          .setCustomId("confirm")
          .setLabel("Confirm")
          .setDisabled(),
        new ButtonBuilder()
          .setStyle(ButtonStyle.Secondary)
          .setCustomId("deny")
          .setLabel("Deny")
          .setDisabled()
      );

      if (i.customId === "confirm") {
        let newSchema;
        newSchema = await overallSchema.findOne({
          guildID: i.guild.id,
        });
        newSchema.donationLogs = data.channel.id;
        await newSchema.save();
        interaction.editReply({
          content: `Successfully changed the donation logs to ${data.channel}.`,
          components: [disabledRow],
        });
      }

      if (i.customId === "deny") {
        interaction.editReply({
          content: "Cancelled this process.",
          components: [disabledRow],
        });
      }
    });

    let disabledRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId("confirm")
        .setLabel("Confirm")
        .setDisabled(),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId("deny")
        .setLabel("Deny")
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
