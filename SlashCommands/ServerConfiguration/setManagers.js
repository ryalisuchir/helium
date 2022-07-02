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
  name: "setmanager",
  description: "Set an events/heist/giveaway manager for a specific guild.",
  type: ApplicationCommandType.ChatInput,
  category: "ServerConfiguration",
  options: [
    {
      name: "events",
      description: "Set the events manager role.",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "role_id",
          description: "The event manager role ID.",
          type: ApplicationCommandOptionType.Role,
          required: true,
        },
      ],
    },
    {
      name: "heists",
      description: "Set the heist manager role.",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "role_id",
          description: "The heist manager role ID.",
          type: ApplicationCommandOptionType.Role,
          required: true,
        },
      ],
    },
    {
      name: "giveaways",
      description: "Set the giveaway manager role.",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "role_id",
          description: "The giveaway manager role ID.",
          type: ApplicationCommandOptionType.Role,
          required: true,
        },
      ],
    },
    {
      name: "middleman",
      description: "Set the middleman manager role.",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "role_id",
          description: "The middleman manager role ID.",
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
        interaction.member.permissions.has([PermissionFlagsBits.Administrator])
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
            eventsManager: data.role,
          });
          serverProfile.save();
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription(
                  "Successfully set the events manager role: <@&" +
                    data.role +
                    ">"
                )
                .setColor("303136"),
            ],
          });
        } else if (!serverProfile.eventsManager) {
          let serverProfile1;
          try {
            serverProfile1 = await overallSchema.findOne({
              guildID: interaction.guild.id,
            });
          } catch (err) {
            console.log(err);
          }
          serverProfile1.eventsManager = data.role;
          await serverProfile1.save();
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription(
                  "Successfully set the events manager role: <@&" +
                    data.role +
                    ">"
                )
                .setColor("303136"),
            ],
          });
        } else {
          console.log(`<@&${data.role.id}>`);
          console.log(serverProfile.eventsManager);
          if (`<@&${data.role.id}>` === serverProfile.eventsManager) {
            return interaction.reply({
              embeds: [
                new EmbedBuilder()
                  .setDescription(
                    `The role, ${data.role} is already set as the events manager role.`
                  )
                  .setColor("303136"),
              ],
            });
          }
          interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription(
                  `There exists an events manager role set for this guild already, ${serverProfile.eventsManager}.

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
        interaction.member.permissions.has([PermissionFlagsBits.Administrator])
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
            heistManager: data.role,
          });
          serverProfile.save();
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription(
                  "Successfully set the heists manager role: <@&" +
                    data.role +
                    ">"
                )
                .setColor("303136"),
            ],
          });
          //here
        } else if (!serverProfile.heistManager) {
          let serverProfile2;
          try {
            serverProfile2 = await overallSchema.findOne({
              guildID: interaction.guild.id,
            });
          } catch (err) {
            console.log(err);
          }
          serverProfile2.heistManager = data.role;
          await serverProfile2.save();
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription(
                  "Successfully set the heists manager role: <@&" +
                    data.role +
                    ">"
                )
                .setColor("303136"),
            ],
          });
        } else {
          //here
          console.log(`<@&${data.role.id}>`);
          console.log(serverProfile.heistManager);
          if (`<@&${data.role.id}>` === serverProfile.heistManager) {
            return interaction.reply({
              embeds: [
                new EmbedBuilder()
                  .setDescription(
                    `The role, ${data.role} is already set as the heist manager role.`
                  )
                  .setColor("303136"),
              ],
            });
          }
          interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription(
                  `There exists a heist manager role set for this guild already, ${serverProfile.heistManager}.

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
        interaction.member.permissions.has([PermissionFlagsBits.Administrator])
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
            giveawayManager: data.role,
          });
          serverProfile.save();
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription(
                  "Successfully set the giveaway manager role: <@&" +
                    data.role +
                    ">"
                )
                .setColor("303136"),
            ],
          });
          //here
        } else if (!serverProfile.giveawayManager) {
          let serverProfile3;
          try {
            serverProfile3 = await overallSchema.findOne({
              guildID: interaction.guild.id,
            });
          } catch (err) {
            console.log(err);
          }
          serverProfile3.giveawayManager = data.role;
          await serverProfile3.save();
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription(
                  "Successfully set the giveaway manager role: <@&" +
                    data.role +
                    ">"
                )
                .setColor("303136"),
            ],
          });
        } else {
          //here
          console.log(`<@&${data.role.id}>`);
          console.log(serverProfile.giveawayManager);
          if (`<@&${data.role.id}>` === serverProfile.giveawayManager) {
            return interaction.reply({
              embeds: [
                new EmbedBuilder()
                  .setDescription(
                    `The role, ${data.role} is already set as the giveaway manager role.`
                  )
                  .setColor("303136"),
              ],
            });
          }
          interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription(
                  `There exists a giveaway manager role set for this guild already, ${serverProfile.giveawayManager}.

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

    //MIDDLEMAN
    if (subcommand === "middleman") {
      if (
        interaction.member.permissions.has([PermissionFlagsBits.Administrator])
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
            middlemanManager: data.role,
          });
          serverProfile.save();
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription(
                  "Successfully set the middleman manager role: <@&" +
                    data.role +
                    ">"
                )
                .setColor("303136"),
            ],
          });
          //here
        } else if (!serverProfile.middlemanManager) {
          let serverProfile3;
          try {
            serverProfile3 = await overallSchema.findOne({
              guildID: interaction.guild.id,
            });
          } catch (err) {
            console.log(err);
          }
          serverProfile3.middlemanManager = data.role;
          await serverProfile3.save();
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription(
                  "Successfully set the middleman manager role: <@&" +
                    data.role +
                    ">"
                )
                .setColor("303136"),
            ],
          });
        } else {
          //here
          console.log(`<@&${data.role.id}>`);
          console.log(serverProfile.middlemanManager);
          if (`<@&${data.role.id}>` === serverProfile.middlemanManager) {
            return interaction.reply({
              embeds: [
                new EmbedBuilder()
                  .setDescription(
                    `The role, ${data.role} is already set as the middleman manager role.`
                  )
                  .setColor("303136"),
              ],
            });
          }
          interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription(
                  `There exists a middleman manager role set for this guild already, ${serverProfile.middlemanManager}.

Confirm that you would like to switch this role to ${data.role} using the interaction.`
                )
                .setColor("303136"),
            ],
            components: [
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setStyle(ButtonStyle.Secondary)
                  .setLabel("Confirm")
                  .setCustomId("confirmm"),
                new ButtonBuilder()
                  .setStyle(ButtonStyle.Secondary)
                  .setLabel("Deny")
                  .setCustomId("denym")
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
    //MIDDLEMAN

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

        serverProfileUpdated.eventsManager = data.role;
        await serverProfileUpdated.save();

        await i.editReply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                "Successfully set the events manager role: <@&" +
                  data.role +
                  ">"
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
        serverProfileUpdatedH.heistManager = data.role;
        await serverProfileUpdatedH.save();

        await i.editReply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                "Successfully set the heist manager role: <@&" + data.role + ">"
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
        serverProfileUpdatedG.giveawayManager = data.role;
        await serverProfileUpdatedG.save();

        await i.editReply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                "Successfully set the giveaway manager role: <@&" +
                  data.role +
                  ">"
              )
              .setColor("303136"),
          ],
        });
      } else if (i.customId === "confirmm") {
        await i.deferUpdate();
        await wait(1500);
        let serverProfileUpdatedM;
        try {
          serverProfileUpdatedM = await overallSchema.findOne({
            guildID: interaction.guild.id,
          });
        } catch (err) {
          console.log(err);
        }
        serverProfileUpdatedM.middlemanManager = data.role;
        await serverProfileUpdatedM.save();

        await i.editReply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                "Successfully set the middleman manager role: <@&" +
                  data.role +
                  ">"
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
              .setDescription(
                "Cancelled the process of switching managing roles."
              )
              .setColor("303136"),
          ],
          components: [disabledRow],
        });
      }
    });
  },
};
