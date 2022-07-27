const {
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");

const Event = require("../../Structures/Classes/event");
const donationSchema = require("../../Schemas/donationSchema");
const overallSchema = require("../../Schemas/guildConfigurationSchema");
const client = require("../../index");
const wait = require("node:timers/promises").setTimeout;

module.exports = new Event("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;
  if (interaction.customId.startsWith("accept-event-")) {
    let messageID = interaction.customId.slice(13, -39);
    let donorID = interaction.customId.slice(33, -20);
    let channelID = interaction.customId.slice(52);
    console.log(messageID);
    console.log(donorID);
    console.log(channelID);
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
        ephemeral: true,
      });
    let managerID = serverProfile.eventsManager.slice(3, -1);
    if (
      !interaction.member.roles.cache.has(managerID) &&
      !interaction.member.permissions.has([PermissionFlagsBits.Administrator])
    ) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              "You do not have the needed permissions to accept events."
            )
            .setColor("303136"),
        ],
        ephemeral: true,
      });
    }
    if (interaction.user.id === donorID)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription("You cannot accept an event for which you donated.")
            .setColor("303136"),
        ],
        ephemeral: true,
      });
    interaction.deferUpdate();
    wait(1200);
    interaction.message.edit({
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setLabel("Accept")
            .setCustomId("acceptDisabled")
            .setDisabled()
        ),
      ],
    });
    let message = await client.channels.cache
      .get(channelID)
      .messages.fetch(messageID);
    message.reply({
      content: `<@${donorID}>`,
      embeds: [
        new EmbedBuilder()
          .setDescription(
            `${interaction.user} has accepted your event.
Please send them what you requested to donate.`
          )
          .setFooter({ text: "Thank you for donating." })
          .setColor("303136"),
      ],
    });

    let donatingSchema;
    donatingSchema = await donationSchema.findOne({
      userID: interaction.user.id,
      guildID: interaction.guild.id,
    });
    if (!donatingSchema) {
      donatingSchema = new donationSchema({
        userID: interaction.user.id,
        guildID: interaction.guild.id,
      });
      await donatingSchema.save();
    }
    let timesAccepted = donatingSchema.timesAccepted.event;
    donatingSchema.timesAccepted.event = timesAccepted + 1;
    await donatingSchema.save();

    let dSchema;
    dSchema = await donationSchema.findOne({
      userID: donorID,
      guildID: interaction.guild.id,
    });

    let timesDonated = dSchema.timesDonated.event;
    dSchema.timesDonated.event = timesDonated + 1;
    dSchema.pendingDonations.event = false;
    await dSchema.save();
    //HEIST
    //HEIST
    //HEIST
    //HEIST
  } else if (interaction.customId.startsWith("accept-heist-")) {
    let messageID = interaction.customId.slice(13, -39);
    let donorID = interaction.customId.slice(33, -20);
    let channelID = interaction.customId.slice(52);
    console.log(messageID);
    console.log(donorID);
    console.log(channelID);
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
        ephemeral: true,
      });
    let managerID = serverProfile.heistManager.slice(3, -1);
    if (
      !interaction.member.roles.cache.has(managerID) &&
      !interaction.member.permissions.has([PermissionFlagsBits.Administrator])
    ) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              "You do not have the needed permissions to accept heists."
            )
            .setColor("303136"),
        ],
        ephemeral: true,
      });
    }
    if (interaction.user.id === donorID)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription("You cannot accept an heist for which you donated.")
            .setColor("303136"),
        ],
        ephemeral: true,
      });
    interaction.deferUpdate();
    wait(1200);
    interaction.message.edit({
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setLabel("Accept")
            .setCustomId("acceptDisabled")
            .setDisabled()
        ),
      ],
    });
    let message = await client.channels.cache
      .get(channelID)
      .messages.fetch(messageID);
    message.reply({
      content: `<@${donorID}>`,
      embeds: [
        new EmbedBuilder()
          .setDescription(
            `${interaction.user} has accepted your heist.
Please send them what you requested to donate.`
          )
          .setFooter({ text: "Thank you for donating." })
          .setColor("303136"),
      ],
    });

    let donatingSchema;
    donatingSchema = await donationSchema.findOne({
      userID: interaction.user.id,
      guildID: interaction.guild.id,
    });
    if (!donatingSchema) {
      donatingSchema = new donationSchema({
        userID: interaction.user.id,
        guildID: interaction.guild.id,
      });
      await donatingSchema.save();
    }
    let timesAccepted = donatingSchema.timesAccepted.heist;
    donatingSchema.timesAccepted.heist = timesAccepted + 1;
    await donatingSchema.save();

    let dSchema;
    dSchema = await donationSchema.findOne({
      userID: donorID,
      guildID: interaction.guild.id,
    });

    let timesDonated = dSchema.timesDonated.heist;
    dSchema.timesDonated.heist = timesDonated + 1;
    dSchema.pendingDonations.heist = false;
    await dSchema.save();
  } else if (interaction.customId.startsWith("accept-giveaway")) {
    let messageID = interaction.customId.slice(16, -39);
    let donorID = interaction.customId.slice(36, -20);
    let channelID = interaction.customId.slice(55);
    console.log(messageID);
    console.log(donorID);
    console.log(channelID);

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
        ephemeral: true,
      });
    let managerID = serverProfile.giveawayManager.slice(3, -1);
    if (
      !interaction.member.roles.cache.has(managerID) &&
      !interaction.member.permissions.has([PermissionFlagsBits.Administrator])
    ) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              "You do not have the needed permissions to accept giveaways."
            )
            .setColor("303136"),
        ],
        ephemeral: true,
      });
    }
    if (interaction.user.id === donorID)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              "You cannot accept an giveaway for which you donated."
            )
            .setColor("303136"),
        ],
        ephemeral: true,
      });
    interaction.deferUpdate();
    wait(1200);
    interaction.message.edit({
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setLabel("Accept")
            .setCustomId("acceptDisabled")
            .setDisabled()
        ),
      ],
    });
    let message = await client.channels.cache
      .get(channelID)
      .messages.fetch(messageID);
    message.reply({
      content: `<@${donorID}>`,
      embeds: [
        new EmbedBuilder()
          .setDescription(
            `${interaction.user} has accepted your giveaway.
Please send them what you requested to donate.`
          )
          .setFooter({ text: "Thank you for donating." })
          .setColor("303136"),
      ],
    });

    let donatingSchema;
    donatingSchema = await donationSchema.findOne({
      userID: interaction.user.id,
      guildID: interaction.guild.id,
    });
    if (!donatingSchema) {
      donatingSchema = new donationSchema({
        userID: interaction.user.id,
        guildID: interaction.guild.id,
      });
      await donatingSchema.save();
    }
    let timesAccepted = donatingSchema.timesAccepted.giveaway;
    donatingSchema.timesAccepted.giveaway = timesAccepted + 1;
    await donatingSchema.save();

    let dSchema;
    dSchema = await donationSchema.findOne({
      userID: donorID,
      guildID: interaction.guild.id,
    });

    let timesDonated = dSchema.timesDonated.giveaway;
    dSchema.timesDonated.giveaway = timesDonated + 1;
    dSchema.pendingDonations.giveaway = false;
    await dSchema.save();
  }
});
