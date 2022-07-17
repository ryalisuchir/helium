const overallSchema = require("../../Schemas/guildConfigurationSchema");
const donationSchema = require("../../Schemas/donationSchema");
const cooldownSchema = require("../../Schemas/cooldownSchema");
const prettyMilliseconds = require("pretty-ms");
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
  name: "partnerping",
  description: "a test command",
  type: ApplicationCommandType.ChatInput,
  category: "User_Specific",
  options: [
    {
      name: "ping",
      description: "the ping ur using",
      type: ApplicationCommandOptionType.String,
      autocomplete: true,
      required: true,
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
    if (!serverProfile || !serverProfile.partnershipManager) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              "This guild does not have a partnership manager role set."
            )
            .setColor("303136"),
        ],
        ephemeral: true,
      });
    }
    let managerID = serverProfile.partnershipManager.slice(3, -1);
    if (
      !interaction.member.roles.cache.has(managerID) &&
      !interaction.member.permissions.has([PermissionFlagsBits.Administrator])
    ) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription("You do not have permissions to use this command.")
            .setColor("303136"),
        ],
        ephemeral: true,
      });
    }

    if (
      interaction.options.getString("ping") !== "everyone" &&
      interaction.options.getString("ping") !== "here" &&
      interaction.options.getString("ping") !== "giveaways" &&
      interaction.options.getString("ping") !== "events" &&
      interaction.options.getString("ping") !== "heists"
    ) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription("Please choose one of the options...")
            .setColor("303136"),
        ],
        ephemeral: true,
      });
    }

    let cooldown;
    try {
      cooldown = await cooldownSchema.findOne({
        userID: interaction.user.id,
        guildID: interaction.guild.id,
        commandName: "partner",
      });
      if (!cooldown) {
        cooldown = await cooldownSchema.create({
          userID: interaction.user.id,
          guildID: interaction.guild.id,
          commandName: "partner",
          cooldown: 0,
        });
        cooldown.save();
      }
    } catch (e) {
      console.error(e);
    }

    let timeout = 1800; //setting cooldown

    if (!cooldown || timeout * 1000 - (Date.now() - cooldown.cooldown) > 0) {
      let timecommand = prettyMilliseconds(timeout * 1000, {
        verbose: true,
        verbose: true,
      });

      const timeleft = prettyMilliseconds(
        timeout * 1000 - (Date.now() - cooldown.cooldown),
        {
          verbose: true,
        }
      );
      const timeleft2 = timeout * 1000 - (Date.now() - cooldown.cooldown);

      let newTime = Math.round(
        (parseInt(Date.now()) + parseInt(Math.round(timeleft2))) / 1000
      );

      let cooldownEmbed = new EmbedBuilder()
        .setDescription(
          `You already did a partnership in the past **${timecommand}**.
> You can partner again in <t:${newTime}:R> (${timeleft})`
        )
        .setColor(`303136`);

      return interaction.reply({
        embeds: [cooldownEmbed],
        ephemeral: true,
      });
    } else {
      await cooldownSchema.findOneAndUpdate(
        {
          userID: interaction.user.id,
          guildID: interaction.guild.id,
          commandName: "partner",
        },
        {
          cooldown: Date.now(),
        }
      );
    }

    if (interaction.options.getString("ping") === "everyone") {
			interaction.reply({
				content: `Your request will go through in the next few seconds...`,
				ephemeral: true
			})
      interaction.channel.send({
        content: `@everyone`,
				allowedMentions: { parse: ['everyone']}
      });
			interaction.channel.send({
        embeds: [
          new EmbedBuilder()
            .setDescription(`${interaction.user} partnered with a new server.`)
            .setColor("303136"),
        ],
			})
    }
    if (interaction.options.getString("ping") === "here") {
			interaction.reply({
				content: `Your request will go through shortly...`,
				ephemeral: true
			})
      interaction.channel.send({
        content: `@here`
      });
			interaction.channel.send({
        embeds: [
          new EmbedBuilder()
            .setDescription(`${interaction.user} partnered with a new server.`)
            .setColor("303136"),
        ],
			})
    }

    if (interaction.options.getString("ping") === "giveaways") {
      if (!serverProfile.giveawayPing) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription("This server has not set up giveaway pings.")
              .setColor("303136"),
          ],
          ephemeral: true,
        });
      } else {
        interaction.reply({
          content: `${serverProfile.giveawayPing}`
        });
				interaction.channel.send({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `${interaction.user} partnered with a new server.`
              )
              .setColor("303136"),
          ],
				})
      }
    }
    if (interaction.options.getString("ping") === "events") {
      if (!serverProfile.eventsPing) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription("This server has not set up events pings.")
              .setColor("303136"),
          ],
          ephemeral: true,
        });
      } else {
        interaction.reply({
          content: `${serverProfile.eventsPing}`
        });
				interaction.channel.send({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `${interaction.user} partnered with a new server.`
              )
              .setColor("303136"),
          ],
				})
      }
    }
    if (interaction.options.getString("ping") === "heists") {
      if (!serverProfile.heistPing) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription("This server has not set up heist pings.")
              .setColor("303136"),
          ],
          ephemeral: true,
        });
      } else {
        interaction.reply({
          content: `${serverProfile.heistPing}`
        });
				interaction.channel.send({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `${interaction.user} partnered with a new server.`
              )
              .setColor("303136"),
          ],
				})
      }
    }
  },
};
