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
  name: "removedonations",
  description: "Remove donations to a specific user in a specified guild.",
  type: ApplicationCommandType.ChatInput,
  category: "User_Specific",
  options: [
    {
      name: "giveaway",
      description: "Remove giveaway donations from a specific user.",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "user",
          description: "The user donating towards the giveaway.",
          type: ApplicationCommandOptionType.User,
          required: true,
        },
        {
          name: "amount",
          description: "The amount being removed.",
          type: ApplicationCommandOptionType.Integer,
          required: true,
        },
      ],
    },
    {
      name: "event",
      description: "Remove event donations from a specific user.",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "user",
          description: "The user donating towards the event.",
          type: ApplicationCommandOptionType.User,
          required: true,
        },
        {
          name: "amount",
          description: "The amount being removed.",
          type: ApplicationCommandOptionType.Integer,
          required: true,
        },
      ],
    },
    {
      name: "heist",
      description: "Remove heist donations from a specific user.",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "user",
          description: "The user donating towards the heist.",
          type: ApplicationCommandOptionType.User,
          required: true,
        },
        {
          name: "amount",
          description: "The amount being removed.",
          type: ApplicationCommandOptionType.Integer,
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

    if (subcommand === "event") {
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
      let managerID = serverProfile.eventsManager.slice(3, -1);
      if (
        !interaction.member.roles.cache.has(managerID) &&
        !interaction.member.permissions.has([
          PermissionFlagsBits.Administrator,
        ]) &&
        interaction.user.id !== "823933160785838091"
      ) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                "You do not have the needed permissions to remove donations in the events category."
              )
              .setColor("303136"),
          ],
          ephemeral: true,
        });
      }

      let eventDonation = {
        amount: interaction.options.getInteger("amount"),
        user: interaction.options.getUser("user"),
      };

      let dSchema;
      dSchema = await donationSchema.findOne({
        userID: eventDonation.user.id,
        guildID: interaction.guild.id,
      });
      if (!dSchema) {
        dSchema = new donationSchema({
          userID: eventDonation.user.id,
          guildID: interaction.guild.id,
        });
      }

      if (parseInt(eventDonation.amount) > parseInt(dSchema.donations.event)) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `You cannot remove more donations than ${
                  eventDonation.user
                } has.

The maximum amount you can remove is **⏣ ${dSchema.donations.event.toLocaleString()}**.

> This is specifically in the events category.`
              )
              .setColor("303136"),
          ],
          ephemeral: true,
        });
      }

      let amountDonated = dSchema.donations.event;
      dSchema.donations.event = Math.round(
        amountDonated - eventDonation.amount
      );
      await dSchema.save();

      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `Removed **⏣ ${eventDonation.amount}** from ${eventDonation.user}'s *event* donations.`
            )
            .setColor("303136"),
        ],
      });
    } else if (subcommand === "giveaway") {
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
      let managerID = serverProfile.giveawayManager.slice(3, -1);
      if (
        !interaction.member.roles.cache.has(managerID) &&
        !interaction.member.permissions.has([
          PermissionFlagsBits.Administrator,
        ]) &&
        interaction.user.id !== "823933160785838091"
      ) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                "You do not have the needed permissions to remove donations in the giveaway category."
              )
              .setColor("303136"),
          ],
          ephemeral: true,
        });
      }

      let giveawayDonation = {
        amount: interaction.options.getInteger("amount"),
        user: interaction.options.getUser("user"),
      };

      let dSchema;
      dSchema = await donationSchema.findOne({
        userID: giveawayDonation.user.id,
        guildID: interaction.guild.id,
      });
      if (!dSchema) {
        dSchema = new donationSchema({
          userID: giveawayDonation.user.id,
          guildID: interaction.guild.id,
        });
      }

      if (
        parseInt(giveawayDonation.amount) > parseInt(dSchema.donations.giveaway)
      ) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `You cannot remove more donations than ${
                  giveawayDonation.user
                } has.

The maximum amount you can remove is **⏣ ${dSchema.donations.giveaway.toLocaleString()}**.

> This is specifically in the giveaways category.`
              )
              .setColor("303136"),
          ],
          ephemeral: true,
        });
      }

      let amountDonated = dSchema.donations.giveaway;
      dSchema.donations.giveaway = Math.round(
        amountDonated - giveawayDonation.amount
      );
      await dSchema.save();

      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `Removed **⏣ ${giveawayDonation.amount}** from ${giveawayDonation.user}'s *giveaway* donations.`
            )
            .setColor("303136"),
        ],
      });
    } else if (subcommand === "heist") {
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
      let managerID = serverProfile.heistManager.slice(3, -1);
      if (
        !interaction.member.roles.cache.has(managerID) &&
        !interaction.member.permissions.has([
          PermissionFlagsBits.Administrator,
        ]) &&
        interaction.user.id !== "823933160785838091"
      ) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                "You do not have the needed permissions to remove donations in the heist category."
              )
              .setColor("303136"),
          ],
          ephemeral: true,
        });
      }

      let heistDonation = {
        amount: interaction.options.getInteger("amount"),
        user: interaction.options.getUser("user"),
      };

      let dSchema;
      dSchema = await donationSchema.findOne({
        userID: heistDonation.user.id,
        guildID: interaction.guild.id,
      });
      if (!dSchema) {
        dSchema = new donationSchema({
          userID: heistDonation.user.id,
          guildID: interaction.guild.id,
        });
      }

      if (parseInt(heistDonation.amount) > parseInt(dSchema.donations.heist)) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `You cannot remove more donations than ${
                  heistDonation.user
                } has.

The maximum amount you can remove is **⏣ ${dSchema.donations.heist.toLocaleString()}**.

> This is specifically in the heists category.`
              )
              .setColor("303136"),
          ],
          ephemeral: true,
        });
      }

      let amountDonated = dSchema.donations.heist;
      dSchema.donations.heist = Math.round(
        amountDonated - heistDonation.amount
      );
      await dSchema.save();

      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `Removed **⏣ ${heistDonation.amount}** from ${heistDonation.user}'s *heist* donations.`
            )
            .setColor("303136"),
        ],
      });
    }

    let newSchema;
    newSchema = await overallSchema.findOne({
      guildID: interaction.guild.id,
    });
    let channel = interaction.guild.channels.cache.get(newSchema.donationLogs);

    try {
      let ahh = {
        user: interaction.options.getMember("user"),
        amount: interaction.options.getInteger("amount"),
      };
      channel.send({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `${interaction.user} successfully removed donations:
<:whiteDot:962849666674860142> **User:** ${ahh.user}
<:whiteDot:962849666674860142> **Amount:** ${ahh.amount.toLocaleString()}
<:whiteDot:962849666674860142> **Category:** ${subcommand}

Time: <t:${Math.round(Date.now() / 1000)}>`
            )
            .setColor("303136"),
        ],
      });
    } catch (err) {
      newSchema.donationLogs = null;
      await newSchema.save();
    }

    if (interaction.guild.id === "986631502362198036") {
      let donation = {
        user: interaction.options.getMember("user"),
      };
      let donationProfileRoles;
      donationProfileRoles = await donationSchema.findOne({
        userID: donation.user.id,
        guildID: interaction.guild.id,
      });

      let totalAmount =
        parseInt(donationProfileRoles.donations.event) +
        parseInt(donationProfileRoles.donations.giveaway) +
        parseInt(donationProfileRoles.donations.heist);

      const member = donation.user;
      if (totalAmount < 10000000) {
        let role = interaction.guild.roles.cache.get("986711729385930803");
        const alreadyHasRole = member.roles.cache.has(role.id);
        if (alreadyHasRole) {
          member.roles.remove(role);
        }
      }
      if (totalAmount < 25000000) {
        let role2 = interaction.guild.roles.cache.get("986635695407890482");
        const alreadyHasRole2 = member.roles.cache.has(role2.id);
        if (alreadyHasRole2) {
          member.roles.remove(role2);
        }
      }
      if (totalAmount < 50000000) {
        let role3 = interaction.guild.roles.cache.get("986635696347414548");
        const alreadyHasRole3 = member.roles.cache.has(role3.id);
        if (alreadyHasRole3) {
          member.roles.remove(role3);
        }
      }
      if (totalAmount < 75000000) {
        let role4 = interaction.guild.roles.cache.get("986635697169526905");
        const alreadyHasRole4 = member.roles.cache.has(role4.id);
        if (alreadyHasRole4) {
          member.roles.remove(role4);
        }
      }
      if (totalAmount < 100000000) {
        let role5 = interaction.guild.roles.cache.get("986635697962238013");
        const alreadyHasRole5 = member.roles.cache.has(role5.id);
        if (alreadyHasRole5) {
          member.roles.remove(role5);
        }
      }
      if (totalAmount < 250000000) {
        let role6 = interaction.guild.roles.cache.get("986635699254087701");
        const alreadyHasRole6 = member.roles.cache.has(role6.id);
        if (alreadyHasRole6) {
          member.roles.remove(role6);
        }
      }
      if (totalAmount < 500000000) {
        let role7 = interaction.guild.roles.cache.get("986635699874824253");
        const alreadyHasRole7 = member.roles.cache.has(role7.id);
        if (alreadyHasRole7) {
          member.roles.remove(role7);
        }
      }
      if (totalAmount < 750000000) {
        let role8 = interaction.guild.roles.cache.get("986635701401571368");
        const alreadyHasRole8 = member.roles.cache.has(role8.id);
        if (alreadyHasRole8) {
          member.roles.remove(role8);
        }
      }

      if (totalAmount < 1000000000) {
        let role9 = interaction.guild.roles.cache.get("986635702290771999");
        const alreadyHasRole9 = member.roles.cache.has(role9.id);
        if (alreadyHasRole9) {
          member.roles.remove(role9);
        }
      }

      if (totalAmount < 2000000000) {
        let role10 = interaction.guild.roles.cache.get("986635703125426236");
        const alreadyHasRole10 = member.roles.cache.has(role10.id);
        if (alreadyHasRole10) {
          member.roles.remove(role10);
        }
      }
    }
  },
};
