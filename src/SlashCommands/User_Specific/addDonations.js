const overallSchema = require("../../Schemas/guildConfigurationSchema");
const donationSchema = require("../../Schemas/donationSchema");
const weeklySchema = require("../../Schemas/weeklyDonationSchema")
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
  name: "adddonations",
  description: "Add donations to a specific user in a specified guild.",
  type: ApplicationCommandType.ChatInput,
  category: "User_Specific",
  options: [
    {
      name: "giveaway",
      description: "Add giveaway donations to a specific user.",
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
          description: "The amount being donated.",
          type: ApplicationCommandOptionType.Integer,
          required: true,
        },
      ],
    },
    {
      name: "event",
      description: "Add event donations to a specific user.",
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
          description: "The amount being donated.",
          type: ApplicationCommandOptionType.Integer,
          required: true,
        },
      ],
    },
    {
      name: "heist",
      description: "Add heist donations to a specific user.",
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
          description: "The amount being donated.",
          type: ApplicationCommandOptionType.Integer,
          required: true,
        },
      ],
    },
    {
      name: "grinder",
      description: "Add grinder donations to a specific user.",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "user",
          description: "The user grinding.",
          type: ApplicationCommandOptionType.User,
          required: true,
        },
        {
          name: "amount",
          description: "The amount being donated.",
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
    let message;
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
                "You do not have the needed permissions to add donations in the events category."
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

      let amountDonated = dSchema.donations.event;
      dSchema.donations.event = Math.round(
        amountDonated + eventDonation.amount
      );
      await dSchema.save();

      message = await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `Added **⏣ ${eventDonation.amount}** to ${eventDonation.user}'s *event* donations.`
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
                "You do not have the needed permissions to add donations in the giveaway category."
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

      let amountDonated = dSchema.donations.giveaway;
      dSchema.donations.giveaway = Math.round(
        amountDonated + giveawayDonation.amount
      );
      await dSchema.save();

      message = await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `Added **⏣ ${giveawayDonation.amount}** to ${giveawayDonation.user}'s *giveaway* donations.`
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
                "You do not have the needed permissions to add donations in the heist category."
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

      let amountDonated = dSchema.donations.heist;
      dSchema.donations.heist = Math.round(
        amountDonated + heistDonation.amount
      );
      await dSchema.save();

      message = await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `Added **⏣ ${heistDonation.amount}** to ${heistDonation.user}'s *heist* donations.`
            )
            .setColor("303136"),
        ],
      });
    } else if (subcommand === "grinder") {
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
        !serverProfile.grinderManager
      )
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `This guild has not setup grinder managers. Please use the following command:
<:slash:980152110127669279> setmanager <grinder> <role>`
              )
              .setColor("303136"),
          ],
        });
      let managerID = serverProfile.grinderManager.slice(3, -1);
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
                "You do not have the needed permissions to add donations in the grinder category."
              )
              .setColor("303136"),
          ],
          ephemeral: true,
        });
      }

      let grinderDonation = {
        amount: interaction.options.getInteger("amount"),
        user: interaction.options.getUser("user"),
      };

      let dSchema;
      dSchema = await donationSchema.findOne({
        userID: grinderDonation.user.id,
        guildID: interaction.guild.id,
      });
      if (!dSchema) {
        dSchema = new donationSchema({
          userID: grinderDonation.user.id,
          guildID: interaction.guild.id,
        });
      }

			let wSchema;
			wSchema = await weeklySchema.findOne({
				userID: grinderDonation.user.id,
				guildID: interaction.guild.id
			});
			if (!wSchema) {
				wSchema = new weeklySchema({
					userID: grinderDonation.user.id,
					guildID: interaction.guild.id
				})
			}

      let amountDonated = dSchema.grinderDonations.totalGrinder;
			let weeklyDonated = wSchema.thisWeek;
      dSchema.grinderDonations.totalGrinder = Math.round(
        amountDonated + grinderDonation.amount
      );
      wSchema.thisWeek = Math.round(
        weeklyDonated + grinderDonation.amount
      );
      await dSchema.save();
			await wSchema.save();

      message = await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `Added **⏣ ${grinderDonation.amount}** to ${grinderDonation.user}'s *grinder* donations.

**Total amount donated for this week:** ⏣ ${Math.round(
        weeklyDonated + grinderDonation.amount
      )}`
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
      const interactionOptions = {
        user: interaction.options.getMember("user"),
        amount: interaction.options.getInteger("amount"),
      };
    try {
      channel.send({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `${interaction.user} successfully added donations:
<:whiteDot:962849666674860142> **User:** ${interactionOptions.user}
<:whiteDot:962849666674860142> **Amount:** ${interactionOptions.amount.toLocaleString()}
<:whiteDot:962849666674860142> **Category:** ${subcommand}

Time: <t:${Math.round(Date.now() / 1000)}>`
            )
            .setColor("303136"),
        ],
        components: [
          new ActionRowBuilder().setComponents(
            new ButtonBuilder()
              .setStyle(ButtonStyle.Link)
              .setLabel("Jump to message")
              .setURL(
                `https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}/${message.id}`
              )
          ),
        ],
      });
    } catch (err) {
      newSchema.donationLogs = null;
      await newSchema.save();
    }

    if (interaction.guild.id === "986631502362198036") {
      let donationProfileRoles;
      donationProfileRoles = await donationSchema.findOne({
        userID: interactionOptions.user.id,
        guildID: interaction.guild.id,
      });

      let totalAmount =
        parseInt(donationProfileRoles.donations.event) +
        parseInt(donationProfileRoles.donations.giveaway) +
        parseInt(donationProfileRoles.donations.heist) + parseInt(donationProfileRoles.grinderDonations.totalGrinder);

      const member = interactionOptions.user;
      if (totalAmount >= 10000000) {
        let role = interaction.guild.roles.cache.get("986711729385930803");
        const alreadyHasRole = member.roles.cache.has(role.id);
        if (!alreadyHasRole) {
          member.roles.add(role);
        }
      }
      if (totalAmount >= 25000000) {
        let role2 = interaction.guild.roles.cache.get("986635695407890482");
        const alreadyHasRole2 = member.roles.cache.has(role2.id);
        if (!alreadyHasRole2) {
          member.roles.add(role2);
        }
      }
      if (totalAmount >= 50000000) {
        let role3 = interaction.guild.roles.cache.get("986635696347414548");
        const alreadyHasRole3 = member.roles.cache.has(role3.id);
        if (!alreadyHasRole3) {
          member.roles.add(role3);
        }
      }
      if (totalAmount >= 75000000) {
        let role3 = interaction.guild.roles.cache.get("986635697169526905");
        const alreadyHasRole3 = member.roles.cache.has(role3.id);
        if (!alreadyHasRole3) {
          member.roles.add(role3);
        }
      }
      if (totalAmount >= 100000000) {
        let role3 = interaction.guild.roles.cache.get("986635697962238013");
        const alreadyHasRole3 = member.roles.cache.has(role3.id);
        if (!alreadyHasRole3) {
          member.roles.add(role3);
        }
      }
      if (totalAmount >= 250000000) {
        let role3 = interaction.guild.roles.cache.get("986635699254087701");
        const alreadyHasRole3 = member.roles.cache.has(role3.id);
        if (!alreadyHasRole3) {
          member.roles.add(role3);
        }
      }
      if (totalAmount >= 500000000) {
        let role3 = interaction.guild.roles.cache.get("986635699874824253");
        const alreadyHasRole3 = member.roles.cache.has(role3.id);
        if (!alreadyHasRole3) {
          member.roles.add(role3);
        }
      }
      if (totalAmount >= 750000000) {
        let role3 = interaction.guild.roles.cache.get("986635701401571368");
        const alreadyHasRole3 = member.roles.cache.has(role3.id);
        if (!alreadyHasRole3) {
          member.roles.add(role3);
        }
      }

      if (totalAmount >= 1000000000) {
        let role3 = interaction.guild.roles.cache.get("986635702290771999");
        const alreadyHasRole3 = member.roles.cache.has(role3.id);
        if (!alreadyHasRole3) {
          member.roles.add(role3);
        }
      }

      if (totalAmount >= 2000000000) {
        let role3 = interaction.guild.roles.cache.get("986635703125426236");
        const alreadyHasRole3 = member.roles.cache.has(role3.id);
        if (!alreadyHasRole3) {
          member.roles.add(role3);
        }
      }
    }
  },
};
