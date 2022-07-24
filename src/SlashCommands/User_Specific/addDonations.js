const {
  EmbedBuilder,
  ApplicationCommandOptionType,
  ApplicationCommandType,
  PermissionFlagsBits,
} = require("discord.js");
const wait = require("node:timers/promises").setTimeout;
const itemsDb = require("../../Schemas/MankDemer/itemsSchema");
const donationDB = require("../../Schemas/donationSchema");
const overallSchema = require("../../Schemas/guildConfigurationSchema");

module.exports = {
  name: "adddonations",
  description: "Add donations to a specific user in a specified guild.",
  type: ApplicationCommandType.ChatInput,
  category: "User_Specific",
  options: [
    {
      name: "subsection",
      description: "What section you're adding the donations to.",
      type: ApplicationCommandOptionType.String,
      autocomplete: true,
      required: true,
    },
    {
      name: "user",
      description: "What user you are adding donations to.",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: "message",
      description: "What message ID of the Dank Memer trade embed.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  /**
   * @param {CommandInteraction} interaction
   */
  run: async (client, interaction, args) => {
    const donationInformation = {
      subsection: interaction.options.getString("subsection"),
      message: interaction.options.getString("message"),
      user: interaction.options.getUser("user"),
    };

    if (
      donationInformation.subsection !== "event" &&
      donationInformation.subsection !== "giveaway" &&
      donationInformation.subsection !== "heist"
    ) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              "That is not a valid subsection. Please select from the autocomplete options provided."
            )
            .setColor("303136"),
        ],
        ephemeral: true,
      });
    }

    let serverProfile;
    try {
      serverProfile = await overallSchema.findOne({
        guildID: interaction.guild.id,
      });
    } catch (err) {
      console.log(err);
    }

    if (!serverProfile) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              "Please set up the bot in this server. You can use the `/help` command for more specifics on commands."
            )
            .setColor("303136"),
        ],
        ephemeral: true,
      });
    }

    if (donationInformation.subsection === "event") {
      if (!serverProfile.eventsManager || !serverProfile.eventsPing) {
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
      }

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
    }

    if (donationInformation.subsection === "giveaway") {
      if (!serverProfile.giveawayManager || !serverProfile.giveawayPing) {
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
      }
    }
    if (donationInformation.subsection === "heist") {
      if (!serverProfile.heistManager || !serverProfile.heistPing) {
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
      }
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
    }
    await interaction.deferReply();
    wait(1500);
    const dankMessage = await interaction.channel.messages.fetch(
      donationInformation.message
    );

    if (!dankMessage.embeds.length) {
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              "Specify the correct message. If it's a valid messsage, this means that I'm broken again, so please DM Shark#2538."
            )
            .setColor("303136"),
        ],
        ephemeral: true,
      });
    }
    console.log(dankMessage);
    console.log(donationInformation.message);
    const dbItems = await itemsDb.find({});
    const itemms = [];
    for (const iitem of dbItems) {
      itemms.push(iitem.display.name.split(" ").join("").toLowerCase());
    }
    const itemArray = getItems(
      dankMessage.embeds[0].fields[0].value.split("\n")
    );
    let toAdd = 0;
    const erray = [];
    let doneTems = [];
    let doneeTems = [];
    for (const item of itemArray.split("\n")) {
      if (!item.length) continue;
      if (item.includes("x")) {
        const temp = item.split("x", 1);
        const amount = temp[0];
        let ktem = item.replace(`${amount}x`, "");

        let final;
        let got = false;
        for (const i of itemms) {
          if (got) continue;
          const res = i.localeCompare(ktem);
          if (res === 0) {
            got = true;
            const value =
              amount *
              (dbItems.find(
                (a) => a.display.name.split(" ").join("").toLowerCase() === ktem
              )
                ? dbItems.find(
                    (a) =>
                      a.display.name.split(" ").join("").toLowerCase() === ktem
                  ).value
                : 0);
            const emoji = dbItems.find(
              (a) => a.display.name.split(" ").join("").toLowerCase() === ktem
            ).item_emoji;
            const name = dbItems.find(
              (a) => a.display.name.split(" ").join("").toLowerCase() === ktem
            ).display.name;

            if (
              !doneTems.includes(
                `${amount}x ${emoji} ${name}: ⏣ ${value.toLocaleString()}`
              )
            )
              doneTems.push(
                `${amount}x ${emoji} ${name}: ⏣ ${value.toLocaleString()}`
              );
            toAdd += value;
          } else {
          }
        }
      } else {
        if (!doneTems.includes(`⏣ ${parseInt(item)}`)) {
          doneTems.push(`⏣ ${parseInt(item)}`);
        }
        toAdd += parseInt(item);
      }
    }
    const donationEmbed = new EmbedBuilder()
      .setDescription(`Logged items:\n> ${doneTems.join("\n> ")}`)
      .setColor("303136");
    let dbUser;
    try {
      dbUser = await donationDB.findOne({
        userID: donationInformation.user.id,
        guildID: interaction.guild.id,
      });
      if (!dbUser) {
        dbUser = new donationDB({
          userID: donationInformation.user.id,
          guildID: interaction.guild.id,
        });
      }

      if (donationInformation.subsection === "event") {
        dbUser.donations.event += toAdd;
      }
      if (donationInformation.subsection === "giveaway") {
        dbUser.donations.giveaway += toAdd;
      }
      if (donationInformation.subsection === "heist") {
        dbUser.donations.heist += toAdd;
      }

      dbUser.save();
    } catch (error) {
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `Ran into an error:
${error.message}`
            )
            .setFooter({
              text: "Since this method of adding donations is in a beta stage, please DM Shark#2538 if this continues to persist.",
            }),
        ],
        ephemeral: true,
      });
    }
    interaction.editReply({
      embeds: [
        donationEmbed,
        new EmbedBuilder()
          .setDescription(
            `Added ⏣ ${toAdd.toLocaleString()} to ${
              donationInformation.user
            }'s *${donationInformation.subsection}* donations.`
          )
          .setColor("303136"),
      ],
    });
    let newSchema;
    newSchema = await overallSchema.findOne({
      guildID: interaction.guild.id,
    });
    let channel = interaction.guild.channels.cache.get(newSchema.donationLogs);

    try {
      let ahh = {
        user: interaction.options.getMember("user"),
      };
      channel.send({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `${interaction.user} successfully added donations:
<:whiteDot:962849666674860142> **User:** ${ahh.user}
<:whiteDot:962849666674860142> **Amount:** ${toAdd.toLocaleString()}
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
      let donation = {
        user: interaction.options.getMember("user"),
      };
      let donationProfileRoles;
      donationProfileRoles = await donationDB.findOne({
        userID: donation.user.id,
        guildID: interaction.guild.id,
      });

      let totalAmount =
        parseInt(donationProfileRoles.donations.event) +
        parseInt(donationProfileRoles.donations.giveaway) +
        parseInt(donationProfileRoles.donations.heist);

      const member = donation.user;
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

function getItems(item) {
  let information = "";
  item.forEach((value) => {
    if (value.includes("⏣ ")) {
      information += "\n" + value.split("⏣ ")[1].replace(/(\*|,)/g, "");
    } else {
      let information2 = value
        .split("**")
        .join("")
        .split(" ")
        .join("")
        .replace(/(>|:)/g, " ")
        .split(" ");
      const number = value
        .split("**")
        .join("")
        .split(" ")
        .join("")
        .replace(/(>|:)/g, " ")
        .split(" ")
        .filter((information) => information.includes("x"))[0]
        .replace(/(<a|,|<)/g, "");
      information +=
        "\n" + number + information2[information2.length - 1].toLowerCase();
    }
  });
  return information;
}
