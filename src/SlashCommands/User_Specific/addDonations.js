const {
  EmbedBuilder,
  ApplicationCommandOptionType,
  ApplicationCommandType,
  PermissionFlagsBits,
} = require("discord.js");
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
      name: "message",
      description: "What message ID of the Dank Memer trade embed.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "user",
      description: "What user you are adding donations to.",
      type: ApplicationCommandOptionType.User,
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
    }

    const dankMessage = await interaction.channel.messages.fetch(
      donationInformation.message
    );
    if (!dankMessage.embeds.length) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder().setDescription("Specify the correct message."),
        ],
        ephemeral: true,
      });
    }
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
      return interaction.reply({
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
    return interaction.reply({
      embeds: [
        donationEmbed,
        new EmbedBuilder().setDescription(
          `Added ⏣ ${toAdd.toLocaleString()} to ${
            donationInformation.user
          }'s *${donationInformation.subsection}* donations.`
        ),
      ],
    });
  },
};

function getItems(arr) {
  let a = "";
  arr.forEach((value) => {
    if (value.includes("⏣ ")) {
      a += "\n" + value.split("⏣ ")[1].replace(/(\*|,)/g, "");
    } else {
      let aa = value
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
        .filter((a) => a.includes("x"))[0]
        .replace(/(<a|,|<)/g, "");
      a += "\n" + number + aa[aa.length - 1].toLowerCase();
    }
  });
  return a;
};