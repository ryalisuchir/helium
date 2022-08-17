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
  name: "setpings",
  description: "Set an events/heist/giveaway pings for a specific guild.",
  type: ApplicationCommandType.ChatInput,
  category: "ServerConfiguration",
  options: [
    {
      name: "events",
      description: "Set the events pings role.",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "role_id",
          description: "The event pings role ID.",
          type: ApplicationCommandOptionType.Role,
          required: true,
        },
      ],
    },
    {
      name: "heists",
      description: "Set the heist pings role.",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "role_id",
          description: "The heist pings role ID.",
          type: ApplicationCommandOptionType.Role,
          required: true,
        },
      ],
    },
    {
      name: "giveaways",
      description: "Set the giveaway pings role.",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "role_id",
          description: "The giveaway pings role ID.",
          type: ApplicationCommandOptionType.Role,
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

    const data = {
      role: interaction.options.getRole("role_id"),
    };
    //EVENTS
    if (subcommand === "events") {
      if (
        interaction.member.permissions.has([
          PermissionFlagsBits.Administrator,
        ]) ||
        interaction.user.id == "823933160785838091"
      ) {
        let serverProfile;
        try {
          serverProfile = await overallSchema.findOne({
            guildID: interaction.guild.id,
          });
        } catch (err) {
          console.log(err);
        }
        if (!serverProfile) {
          serverProfile = new overallSchema({
            guildID: interaction.guild.id,
            eventsPing: data.role,
          });
          serverProfile.save();
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription(
                  "Successfully set the events pings role: <@&" +
                    data.role +
                    ">"
                )
                .setColor("303136"),
            ],
          });
        } else if (!serverProfile.eventsPing) {
          let serverProfile1;
          try {
            serverProfile1 = await overallSchema.findOne({
              guildID: interaction.guild.id,
            });
          } catch (err) {
            console.log(err);
          }
          serverProfile1.eventsPing = data.role;
          await serverProfile1.save();
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription(
                  "Successfully set the events pings role: <@&" +
                    data.role +
                    ">"
                )
                .setColor("303136"),
            ],
          });
        } else {
          console.log(`<@&${data.role.id}>`);
          console.log(serverProfile.eventsPing);
          if (`<@&${data.role.id}>` === serverProfile.eventsPing) {
            return interaction.reply({
              embeds: [
                new EmbedBuilder()
                  .setDescription(
                    `The role, ${data.role} is already set as the events ping role.`
                  )
                  .setColor("303136"),
              ],
            });
          }
          interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription(
                  `There exists an events ping role set for this guild already, ${serverProfile.eventsPing}.

Confirm that you would like to switch this role to ${data.role} using the interaction.`
                )
                .setColor("303136"),
            ],
            components: [
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setStyle(ButtonStyle.Secondary)
                  .setLabel("Confirm")
                  .setCustomId("confirme"),
                new ButtonBuilder()
                  .setStyle(ButtonStyle.Secondary)
                  .setLabel("Deny")
                  .setCustomId("denye")
              ),
            ],
          });
        }
      } else {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                "You do not have permissions to run this command."
              )
              .setColor("303136"),
          ],
          ephemeral: true,
        });
      }
    }
    //EVENTS
    //HEISTS
    if (subcommand === "heists") {
      if (
        interaction.member.permissions.has([
          PermissionFlagsBits.Administrator,
        ]) ||
        interaction.user.id == "823933160785838091"
      ) {
        let serverProfile;
        try {
          serverProfile = await overallSchema.findOne({
            guildID: interaction.guild.id,
          });
        } catch (err) {
          console.log(err);
        }
        if (!serverProfile) {
          serverProfile = new overallSchema({
            guildID: interaction.guild.id,
            heistPing: data.role,
          });
          serverProfile.save();
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription(
                  "Successfully set the heists ping role: <@&" + data.role + ">"
                )
                .setColor("303136"),
            ],
          });
          //here
        } else if (!serverProfile.heistPing) {
          let serverProfile2;
          try {
            serverProfile2 = await overallSchema.findOne({
              guildID: interaction.guild.id,
            });
          } catch (err) {
            console.log(err);
          }
          serverProfile2.heistPing = data.role;
          await serverProfile2.save();
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription(
                  "Successfully set the heists ping role: <@&" + data.role + ">"
                )
                .setColor("303136"),
            ],
          });
        } else {
          //here
          console.log(`<@&${data.role.id}>`);
          console.log(serverProfile.heistPing);
          if (`<@&${data.role.id}>` === serverProfile.heistPing) {
            return interaction.reply({
              embeds: [
                new EmbedBuilder()
                  .setDescription(
                    `The role, ${data.role} is already set as the heist ping role.`
                  )
                  .setColor("303136"),
              ],
            });
          }
          interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription(
                  `There exists a heist ping role set for this guild already, ${serverProfile.heistPing}.

Confirm that you would like to switch this role to ${data.role} using the interaction.`
                )
                .setColor("303136"),
            ],
            components: [
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setStyle(ButtonStyle.Secondary)
                  .setLabel("Confirm")
                  .setCustomId("confirmh"),
                new ButtonBuilder()
                  .setStyle(ButtonStyle.Secondary)
                  .setLabel("Deny")
                  .setCustomId("denyh")
              ),
            ],
          });
        }
      } else {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                "You do not have permissions to run this command."
              )
              .setColor("303136"),
          ],
          ephemeral: true,
        });
      }
    }
    //HEISTS

    //GIVEAWAYS
    if (subcommand === "giveaways") {
      if (
        interaction.member.permissions.has([
          PermissionFlagsBits.Administrator,
        ]) ||
        interaction.user.id == "823933160785838091"
      ) {
        let serverProfile;
        try {
          serverProfile = await overallSchema.findOne({
            guildID: interaction.guild.id,
          });
        } catch (err) {
          console.log(err);
        }
        if (!serverProfile) {
          serverProfile = new overallSchema({
            guildID: interaction.guild.id,
            giveawayPing: data.role,
          });
          serverProfile.save();
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription(
                  "Successfully set the giveaway ping role: <@&" +
                    data.role +
                    ">"
                )
                .setColor("303136"),
            ],
          });
          //here
        } else if (!serverProfile.giveawayPing) {
          let serverProfile3;
          try {
            serverProfile3 = await overallSchema.findOne({
              guildID: interaction.guild.id,
            });
          } catch (err) {
            console.log(err);
          }
          serverProfile3.giveawayPing = data.role;
          await serverProfile3.save();
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription(
                  "Successfully set the giveaway ping role: <@&" +
                    data.role +
                    ">"
                )
                .setColor("303136"),
            ],
          });
        } else {
          //here
          console.log(`<@&${data.role.id}>`);
          console.log(serverProfile.giveawayPing);
          if (`<@&${data.role.id}>` === serverProfile.giveawayPing) {
            return interaction.reply({
              embeds: [
                new EmbedBuilder()
                  .setDescription(
                    `The role, ${data.role} is already set as the giveaway ping role.`
                  )
                  .setColor("303136"),
              ],
            });
          }
          interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription(
                  `There exists a giveaway ping role set for this guild already, ${serverProfile.giveawayPing}.

Confirm that you would like to switch this role to ${data.role} using the interaction.`
                )
                .setColor("303136"),
            ],
            components: [
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setStyle(ButtonStyle.Secondary)
                  .setLabel("Confirm")
                  .setCustomId("confirmg"),
                new ButtonBuilder()
                  .setStyle(ButtonStyle.Secondary)
                  .setLabel("Deny")
                  .setCustomId("denyg")
              ),
            ],
          });
        }
      } else {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                "You do not have permissions to run this command."
              )
              .setColor("303136"),
          ],
          ephemeral: true,
        });
      }
    }
    //GIVEAWAYS

    const collector = interaction.channel.createMessageComponentCollector({
      time: 10000,
      max: 1,
    });
    collector.on("collect", async (i) => {
      const disabledRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setStyle(ButtonStyle.Secondary)
          .setLabel("Confirm")
          .setDisabled()
          .setCustomId("confirmed"),
        new ButtonBuilder()
          .setStyle(ButtonStyle.Secondary)
          .setLabel("Deny")
          .setCustomId("denyed")
          .setDisabled()
      );
      if (i.user.id !== interaction.user.id) return;
      if (i.customId === "confirme") {
        await i.deferUpdate();
        await wait(1500);

        let serverProfileUpdated;
        try {
          serverProfileUpdated = await overallSchema.findOne({
            guildID: interaction.guild.id,
          });
        } catch (err) {
          console.log(err);
        }

        serverProfileUpdated.eventsPing = data.role;
        await serverProfileUpdated.save();

        await i.editReply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                "Successfully set the events ping role: <@&" + data.role + ">"
              )
              .setColor("303136"),
          ],
          components: [disabledRow],
        });
      } else if (i.customId === "confirmh") {
        await i.deferUpdate();
        await wait(1500);
        let serverProfileUpdatedH;
        try {
          serverProfileUpdatedH = await overallSchema.findOne({
            guildID: interaction.guild.id,
          });
        } catch (err) {
          console.log(err);
        }
        serverProfileUpdatedH.heistPing = data.role;
        await serverProfileUpdatedH.save();

        await i.editReply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                "Successfully set the heist ping role: <@&" + data.role + ">"
              )
              .setColor("303136"),
          ],
        });
      } else if (i.customId === "confirmg") {
        await i.deferUpdate();
        await wait(1500);
        let serverProfileUpdatedG;
        try {
          serverProfileUpdatedG = await overallSchema.findOne({
            guildID: interaction.guild.id,
          });
        } catch (err) {
          console.log(err);
        }
        serverProfileUpdatedG.giveawayPing = data.role;
        await serverProfileUpdatedG.save();

        await i.editReply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                "Successfully set the giveaway ping role: <@&" + data.role + ">"
              )
              .setColor("303136"),
          ],
        });
      } else {
        await i.deferUpdate();
        await wait(1500);
        await i.editReply({
          embeds: [
            new EmbedBuilder()
              .setDescription("Cancelled the process of switching ping roles.")
              .setColor("303136"),
          ],
          components: [disabledRow],
        });
      }
    });
  },
};
