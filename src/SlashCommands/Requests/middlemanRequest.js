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
  name: "middleman",
  description: "Request a middleman during a trade or fight.",
  type: ApplicationCommandType.ChatInput,
  category: "ServerConfiguration",
  options: [
    {
      name: "trade",
      description: "Request a middleman for trades.",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "user",
          description: "The user you are trading with.",
          type: ApplicationCommandOptionType.User,
          required: true,
        },
        {
          name: "amount",
          description:
            "Specify what you are giving, and what you are receiving.",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
    },
    {
      name: "fight",
      description: "Request a middleman for fights.",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "user",
          description: "Specify the user you are fighting.",
          type: ApplicationCommandOptionType.User,
          required: true,
        },
        {
          name: "amount",
          description: "Specify the bet you are fighting for.",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
    },
  ],
  /**
   * @param {CommandInteraction} interaction
   */

  run: async (client, interaction, args) => {
    let subcommand = interaction.options.getSubcommand();
    if (subcommand === "trade") {
      let tradeInformation = {
        user: interaction.options.getUser("user"),
        amount: interaction.options.getString("amount"),
      };
      let serverProfile;
      try {
        serverProfile = await overallSchema.findOne({
          guildID: interaction.guild.id,
        });
      } catch (err) {
        console.log(err);
      }
      if (!serverProfile || !serverProfile.middlemanManager)
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `This guild has not setup middleman managers. Please use the following commands:
<:slash:980152110127669279> setmanager <middleman> <role>`
              )
              .setColor("303136"),
          ],
        });
      if (interaction.user.id === tradeInformation.user.id)
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription("Specify a user other than yourself.")
              .setColor("303136"),
          ],
          ephemeral: true,
        });
      interaction.reply({
        content: `Your request went through <t:${Math.round(
          Date.now() / 1000
        )}:R>.`,
        ephemeral: true,
      });
      interaction.channel.send({
        content: `${serverProfile.middlemanManager}`,
      });
      interaction.channel.send({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `${interaction.user} is requesting a middleman.

**Status:** Trading with ${tradeInformation.user}
**Extra Information:** ${tradeInformation.amount}`
            )
            .setColor("303136"),
        ],
      });
    }

    if (subcommand === "fight") {
      let fightInformation = {
        user: interaction.options.getUser("user"),
        amount: interaction.options.getString("amount"),
      };
      let serverProfile;
      try {
        serverProfile = await overallSchema.findOne({
          guildID: interaction.guild.id,
        });
      } catch (err) {
        console.log(err);
      }
      if (!serverProfile || !serverProfile.middlemanManager)
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `This guild has not setup middleman managers. Please use the following commands:
<:slash:980152110127669279> setmanager <middleman> <role>`
              )
              .setColor("303136"),
          ],
        });
      if (interaction.user.id === fightInformation.user.id)
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription("Specify a user other than yourself.")
              .setColor("303136"),
          ],
          ephemeral: true,
        });
      interaction.reply({
        content: `Your request went through <t:${Math.round(
          Date.now() / 1000
        )}:R>.`,
        ephemeral: true,
      });
      interaction.channel.send({
        content: `${serverProfile.middlemanManager}`,
      });
      interaction.channel.send({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `${interaction.user} is requesting a middleman.

**Status:** Fighting with ${fightInformation.user}
**Extra Information:** ${fightInformation.amount}`
            )
            .setColor("303136"),
        ],
      });
    }
  },
};
