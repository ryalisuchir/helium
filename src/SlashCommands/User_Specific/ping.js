const overallSchema = require("../../Schemas/guildConfigurationSchema");
const wait = require("node:timers/promises").setTimeout;
const prettyMilliseconds = require("pretty-ms");
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
  name: "ping",
  description: "Ping specifically selected roles in a guild.",
  type: ApplicationCommandType.ChatInput,
  category: "ServerConfiguration",
  options: [
    {
      name: "events",
      description: "Ping for events in a specific guild.",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "event",
          description: "The event being hosted.",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
        {
          name: "prize",
          description: "The prize being offered for the event.",
          type: ApplicationCommandOptionType.String,
          required: false,
        },
        {
          name: "message",
          description: "The message for the event.",
          type: ApplicationCommandOptionType.String,
          required: false,
        },
        {
          name: "donor",
          description: "The donor for the event.",
          type: ApplicationCommandOptionType.User,
          required: false,
        },
      ],
    },
    {
      name: "heists",
      description: "Ping for heists in a specific guild.",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "amount",
          description: "The amount being heisted.",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
        {
          name: "message",
          description: "The message for the heist.",
          type: ApplicationCommandOptionType.String,
          required: false,
        },
        {
          name: "donor",
          description: "The donor for the heist.",
          type: ApplicationCommandOptionType.User,
          required: false,
        },
      ],
    },
    {
      name: "giveaways",
      description: "Set the giveaway pings role.",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "message",
          description: "The message for the event.",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
        {
          name: "donor",
          description: "The donor for the event.",
          type: ApplicationCommandOptionType.User,
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
    //events
    if (subcommand === "events") {
      let serverProfile;
      try {
        serverProfile = await overallSchema.findOne({
          guildID: interaction.guild.id,
        });
      } catch (err) {
        console.log(err);
      }
      if (
        !serverProfile ||
        !serverProfile.eventsManager ||
        !serverProfile.eventsPing
      )
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `This guild has not setup event managers and/or event pings. Please use the following commands:
<:slash:980152110127669279> setmanager <event> <role>
<:slash:980152110127669279> setpings <event> <role>`
              )
              .setColor("303136"),
          ],
        });
      let eventData = {
        event: interaction.options.getString("event"),
        prize: interaction.options.getString("prize") || "Not specified.",
        message:
          interaction.options.getString("message") || "Thank the sponsor.",
        donor: interaction.options.getUser("donor") || interaction.user,
      };

      let managerID = serverProfile.eventsManager.slice(3, -1);
      let pingID = serverProfile.eventsPing.slice(3, -1);
      if (
        !interaction.member.roles.cache.has(managerID) &&
        !interaction.member.permissions.has([PermissionFlagsBits.Administrator])
      ) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                "You do not have the needed permissions to ping events."
              )
              .setColor("303136"),
          ],
          ephemeral: true,
        });
      }

      let cooldown;
      try {
        cooldown = await overallSchema.findOne({
          userID: interaction.user.id,
          guildID: interaction.guild.id,
        });
        if (!cooldown) {
          cooldown = await overallSchema.create({
            userID: interaction.user.id,
            guildID: interaction.guild.id,
            eventCooldown: 0,
          });
          cooldown.save();
        }
      } catch (e) {
        console.error(e);
      }

      let timeout = 900; //setting cooldown

      if (
        !cooldown ||
        timeout * 1000 - (Date.now() - cooldown.eventCooldown) > 0
      ) {
        let timecommand = prettyMilliseconds(timeout * 1000, {
          verbose: true,
          verbose: true,
        });

        const timeleft = prettyMilliseconds(
          timeout * 1000 - (Date.now() - cooldown.eventCooldown),
          {
            verbose: true,
          }
        );
        const timeleft2 =
          timeout * 1000 - (Date.now() - cooldown.eventCooldown);

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
        await overallSchema.findOneAndUpdate(
          {
            userID: interaction.user.id,
            guildID: interaction.guild.id,
          },
          {
            eventCooldown: Date.now(),
          }
        );
      }

      interaction.reply({
        content:
          "Events was pinged <t:" +
          Math.round((Date.now() + 500) / 1000) +
          ":R>.",
        ephemeral: true,
      });

      interaction.channel.send({
        content: `<@&${pingID}>`,
      });

      interaction.channel.send({
        embeds: [
          new EmbedBuilder()
            .setTitle(`${interaction.guild.name} Event`)
            .setDescription(
              `
﹒**Event:** ${eventData.event}
﹒**Prize:** ${eventData.prize}
﹒**Donor:** ${eventData.donor}
﹒**Message:** ${eventData.message}`
            )
            .setThumbnail(
              "https://cdn.discordapp.com/emojis/859907931545796639.webp?size=96&quality=lossless"
            )
            .setColor("303136"),
        ],
      });
    } else if (subcommand === "heists") {
      let serverProfile;
      try {
        serverProfile = await overallSchema.findOne({
          guildID: interaction.guild.id,
        });
      } catch (err) {
        console.log(err);
      }
      if (
        !serverProfile ||
        !serverProfile.heistManager ||
        !serverProfile.heistPing
      )
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `This guild has not setup heist managers and/or heist pings. Please use the following commands:
<:slash:980152110127669279> setmanager <heist> <role>
<:slash:980152110127669279> setpings <heist> <role>`
              )
              .setColor("303136"),
          ],
        });
      let heistData = {
        amount: interaction.options.getString("amount"),
        message:
          interaction.options.getString("message") ||
          `Thank ${interaction.guild.name} for the heist.`,
        donor: interaction.options.getUser("donor") || "Not specified.",
      };

      let managerID = serverProfile.heistManager.slice(3, -1);
      let pingID = serverProfile.heistPing.slice(3, -1);
      if (
        !interaction.member.roles.cache.has(managerID) &&
        !interaction.member.permissions.has([PermissionFlagsBits.Administrator])
      ) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                "You do not have the needed permissions to ping heists."
              )
              .setColor("303136"),
          ],
          ephemeral: true,
        });
      }

      interaction.reply({
        content:
          "Heists was pinged <t:" +
          Math.round((Date.now() + 500) / 1000) +
          ":R>.",
        ephemeral: true,
      });

      interaction.channel.send({
        content: `<@&${pingID}>`,
      });

      interaction.channel.send({
        embeds: [
          new EmbedBuilder()
            .setTitle(`${interaction.guild.name} Heist`)
            .setDescription(
              `
﹒**Amount:** ${heistData.amount}
﹒**Message:** ${heistData.message}
﹒**Donor:** ${heistData.donor}`
            )
            .setThumbnail(
              "https://cdn.discordapp.com/emojis/861300228803002368.webp?size=96&quality=lossless"
            )
            .setColor("303136"),
        ],
      });
    } else if (subcommand === "giveaways") {
      let serverProfile;
      try {
        serverProfile = await overallSchema.findOne({
          guildID: interaction.guild.id,
        });
      } catch (err) {
        console.log(err);
      }
      if (
        !serverProfile ||
        !serverProfile.giveawayManager ||
        !serverProfile.giveawayPing
      )
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `This guild has not setup giveaway managers and/or giveaway pings. Please use the following commands:
<:slash:980152110127669279> setmanager <giveaway> <role>
<:slash:980152110127669279> setpings <giveaway> <role>`
              )
              .setColor("303136"),
          ],
        });
      let giveawayData = {
        donor: interaction.options.getUser("donor"),
        message: interaction.options.getString("message"),
      };

      let managerID = serverProfile.giveawayManager.slice(3, -1);
      let pingID = serverProfile.giveawayPing.slice(3, -1);
      if (
        !interaction.member.roles.cache.has(managerID) &&
        !interaction.member.permissions.has([PermissionFlagsBits.Administrator])
      ) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                "You do not have the needed permissions to ping giveaways."
              )
              .setColor("303136"),
          ],
          ephemeral: true,
        });
      }
      let cooldown;
      try {
        cooldown = await overallSchema.findOne({
          userID: interaction.user.id,
          guildID: interaction.guild.id,
        });
        if (!cooldown) {
          cooldown = await overallSchema.create({
            userID: interaction.user.id,
            guildID: interaction.guild.id,
            giveawayCooldown: 0,
          });
          cooldown.save();
        }
      } catch (e) {
        console.error(e);
      }

      let timeout = 900; //setting cooldown

      if (
        !cooldown ||
        timeout * 1000 - (Date.now() - cooldown.giveawayCooldown) > 0
      ) {
        let timecommand = prettyMilliseconds(timeout * 1000, {
          verbose: true,
          verbose: true,
        });

        const timeleft = prettyMilliseconds(
          timeout * 1000 - (Date.now() - cooldown.giveawayCooldown),
          {
            verbose: true,
          }
        );
        const timeleft2 =
          timeout * 1000 - (Date.now() - cooldown.giveawayCooldown);

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
        await overallSchema.findOneAndUpdate(
          {
            userID: interaction.user.id,
            guildID: interaction.guild.id,
          },
          {
            giveawayCooldown: Date.now(),
          }
        );
      }
      interaction.reply({
        content:
          "Giveaways was pinged <t:" +
          Math.round((Date.now() + 500) / 1000) +
          ":R>.",
        ephemeral: true,
      });

      interaction.channel.send({
        content: `<@&${pingID}>`,
      });

      interaction.channel.send({
        embeds: [
          new EmbedBuilder()
            .setTitle(`${interaction.guild.name} Giveaway`)
            .setDescription(
              `
﹒**Message:** ${giveawayData.message}
﹒**Donor:** ${giveawayData.donor}`
            )
            .setFooter({ text: "Thank the sponsor for the giveaway." })
            .setThumbnail(
              "https://images-ext-2.discordapp.net/external/Jpi_rvTqMGMlKg0iYJsp1VQJqx1QYVTJUQ2qnbvnk3g/https/images-ext-2.discordapp.net/external/xAwjyj6gystwszrlgor5oXgLuFM5PmA0uNGe5XVX958/https/images-ext-2.discordapp.net/external/oieMnJ5E1T1JttAAx-eyp8mvnI2ohiOaQaVz5Dv4Uo0/%25253Fsize%25253D100%252526quality%25253Dlossless/https/cdn.discordapp.com/emojis/728466706829410345.gif"
            )
            .setColor("303136"),
        ],
      });
    }

    //end code here
  },
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
