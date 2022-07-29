const Command = require("../../Structures/Classes/command");
const itemsDb = require("../../Schemas/MankDemer/itemsSchema");
const donationDB = require("../../Schemas/donationSchema");
const overallSchema = require("../../Schemas/guildConfigurationSchema");
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
module.exports = {
  name: "log",
  alises: ["logthis", "lg"],
  description: "Log a Dank Memer transaction.",
  /**
   *
   * @param {Message} message
   * @param {String[]} args
   * @param {Client} client
   */
  run: async (client, message, args) => {
    if (!args[1]) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              "Use the following format:\n `krypto log <user> <subsection>`"
            )
            .setColor("303136"),
        ],
      });
    }

    if (
      args[1] !== "event" &&
      args[1] !== "giveaway" &&
      args[1] !== "heist" &&
      args[1] !== "1k"
    ) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              "Please select one of these subsections: `event`, `giveaway`, or `heist`."
            )
            .setColor("303136"),
        ],
      });
    }

    if (!args[2] && args[2] !== "1k") {
      return message.reply({
        emebds: [
          new EmbedBuilder().setDescription(
            "Your second argument must be `1k`."
          ),
        ],
      });
    }
    if (
      args[2] === "1k" &&
      message.guild.id !== "986631502362198036" &&
      message.guild.id !== "932785394355941406"
    )
      return;

    let serverProfile;
    try {
      serverProfile = await overallSchema.findOne({
        guildID: message.guild.id,
      });
    } catch (err) {
      console.log(err);
    }

    if (!serverProfile) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              "Please set up the bot in this server. You can use the `/help` command for more specifics on commands."
            )
            .setColor("303136"),
        ],
      });
    }

    if (args[1] === "event") {
      if (!serverProfile.eventsManager || !serverProfile.eventsPing) {
        return message.reply({
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
      }

      let managerID = serverProfile.eventsManager.slice(3, -1);
      if (
        !message.member.roles.cache.has(managerID) &&
        !message.member.permissions.has([PermissionFlagsBits.Administrator]) &&
        message.user.id !== "823933160785838091"
      ) {
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                "You do not have the needed permissions to add donations in the events category."
              )
              .setColor("303136"),
          ],
        });
      }
    }

    if (args[1] === "giveaway") {
      if (!serverProfile.giveawayManager || !serverProfile.giveawayPing) {
        return message.reply({
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
          !message.member.roles.cache.has(managerID) &&
          !message.member.permissions.has([
            PermissionFlagsBits.Administrator,
          ]) &&
          message.user.id !== "823933160785838091"
        ) {
          return message.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription(
                  "You do not have the needed permissions to add donations in the giveaway category."
                )
                .setColor("303136"),
            ],
          });
        }
      }
    }
    if (args[1] === "heist") {
      if (!serverProfile.heistManager || !serverProfile.heistPing) {
        return message.reply({
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
        !message.member.roles.cache.has(managerID) &&
        !message.member.permissions.has([PermissionFlagsBits.Administrator]) &&
        message.user.id !== "823933160785838091"
      ) {
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                "You do not have the needed permissions to add donations in the heist category."
              )
              .setColor("303136"),
          ],
        });
      }
    }

    if (!message.mentions.users.filter((bot) => !bot.bot).size) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription("You must @ the user.")
            .setColor("303136"),
        ],
      });
    }
    const member = message.mentions.users.filter((bot) => !bot.bot).size;

    if (!message.reference) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription("Please reply to the successful transaction.")
            .setColor("303136"),
        ],
      });
    }

    const dankMessage = await message.channel.messages.fetch(
      message.reference.messageId
    );
    if (!dankMessage.embeds.length) {
      return message.reply({
        embeds: [
          new EmbedBuilder().setDescription(
            "This does not seem to be the correct message. Please reply to the correct one."
          ),
        ],
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
    for (const item of itemArray.split("\n")) {
      if (!item.length) continue;
      console.log(item);
      if (item.includes("x")) {
        const temp = item.split("x", 1);
        const amount = temp[0];
        let ktem = item.replace(`${amount}x`, "");
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

    const embed = new EmbedBuilder()
      .setDescription(`Logged items:\n> ${doneTems.join("\n> ")}`)
      .setColor("303136");
    let dbUser;
    try {
      dbUser = await donationDB.findOne({
        userID: message.mentions.users.filter((u) => !u.bot).first().id,
        guildID: message.guild.id,
      });
      if (!dbUser) {
        dbUser = new donationDB({
          userID: message.mentions.users.filter((u) => !u.bot).first().id,
          guildID: message.guild.id,
        });
      }
      if (args[2] === "1k") {
        if (args[1] === "event") {
          dbUser.onethousand.event += toAdd;
        }
        if (args[1] === "giveaway") {
          dbUser.onethousand.giveaway += toAdd;
        }
        if (args[1] === "heist") {
          dbUser.onethousand.heist += toAdd;
        }
      }

      if (args[1] === "event") {
        dbUser.donations.event += toAdd;
      }
      if (args[1] === "giveaway") {
        dbUser.donations.giveaway += toAdd;
      }
      if (args[1] === "heist") {
        dbUser.donations.heist += toAdd;
      }

      dbUser.save();
    } catch (e) {
      return message.reply({
        emebds: [
          new EmbedBuilder()
            .setDescription("Ran into an error adding this amount to the DB...")
            .setColor("303136"),
        ],
      });
    }
    if (args[2] === "1k") {
      message.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              "These donations are part of the Krypto Danker's 1K event:"
            )
            .setColor("303136"),
        ],
      });
    }
    return message.message.channel({
      embeds: [
        embed,
        new EmbedBuilder()
          .setDescription(
            `Added ⏣ ${toAdd.toLocaleString()} to <@${
              message.mentions.users.filter((u) => !u.bot).first().id
            }>'s *${args[1].toLowerCase()}* donations.`
          )
          .setColor("303136"),
      ],
    });

    let newSchema;
    newSchema = await overallSchema.findOne({
      guildID: message.guild.id,
    });
    let channel = message.guild.channels.cache.get(newSchema.donationLogs);

    try {
      channel.send({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `${message.user} successfully added donations:
<:whiteDot:962849666674860142> **User:** ${message.mentions.users
                .filter((u) => !u.bot)
                .first()}
<:whiteDot:962849666674860142> **Amount:** ${toAdd.toLocaleString()}
<:whiteDot:962849666674860142> **Category:** ${args[1].toLowerCase()}

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
                `https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`
              )
          ),
        ],
      });
    } catch (err) {
      newSchema.donationLogs = null;
      await newSchema.save();
    }

    if (message.guild.id === "986631502362198036") {
      let donationProfileRoles;
      donationProfileRoles = await donationSchema.findOne({
        userID: message.mentions.users.filter((u) => !u.bot).first().id,
        guildID: message.guild.id,
      });

      let totalAmount =
        parseInt(donationProfileRoles.donations.event) +
        parseInt(donationProfileRoles.donations.giveaway) +
        parseInt(donationProfileRoles.donations.heist);

      const member = message.mentions.users.filter((u) => !u.bot).first();
      if (totalAmount >= 10000000) {
        let role = message.guild.roles.cache.get("986711729385930803");
        const alreadyHasRole = member.roles.cache.has(role.id);
        if (!alreadyHasRole) {
          member.roles.add(role);
        }
      }
      if (totalAmount >= 25000000) {
        let role2 = message.guild.roles.cache.get("986635695407890482");
        const alreadyHasRole2 = member.roles.cache.has(role2.id);
        if (!alreadyHasRole2) {
          member.roles.add(role2);
        }
      }
      if (totalAmount >= 50000000) {
        let role3 = message.guild.roles.cache.get("986635696347414548");
        const alreadyHasRole3 = member.roles.cache.has(role3.id);
        if (!alreadyHasRole3) {
          member.roles.add(role3);
        }
      }
      if (totalAmount >= 75000000) {
        let role3 = message.guild.roles.cache.get("986635697169526905");
        const alreadyHasRole3 = member.roles.cache.has(role3.id);
        if (!alreadyHasRole3) {
          member.roles.add(role3);
        }
      }
      if (totalAmount >= 100000000) {
        let role3 = message.guild.roles.cache.get("986635697962238013");
        const alreadyHasRole3 = member.roles.cache.has(role3.id);
        if (!alreadyHasRole3) {
          member.roles.add(role3);
        }
      }
      if (totalAmount >= 250000000) {
        let role3 = message.guild.roles.cache.get("986635699254087701");
        const alreadyHasRole3 = member.roles.cache.has(role3.id);
        if (!alreadyHasRole3) {
          member.roles.add(role3);
        }
      }
      if (totalAmount >= 500000000) {
        let role3 = message.guild.roles.cache.get("986635699874824253");
        const alreadyHasRole3 = member.roles.cache.has(role3.id);
        if (!alreadyHasRole3) {
          member.roles.add(role3);
        }
      }
      if (totalAmount >= 750000000) {
        let role3 = message.guild.roles.cache.get("986635701401571368");
        const alreadyHasRole3 = member.roles.cache.has(role3.id);
        if (!alreadyHasRole3) {
          member.roles.add(role3);
        }
      }

      if (totalAmount >= 1000000000) {
        let role3 = message.guild.roles.cache.get("986635702290771999");
        const alreadyHasRole3 = member.roles.cache.has(role3.id);
        if (!alreadyHasRole3) {
          member.roles.add(role3);
        }
      }

      if (totalAmount >= 2000000000) {
        let role3 = message.guild.roles.cache.get("986635703125426236");
        const alreadyHasRole3 = member.roles.cache.has(role3.id);
        if (!alreadyHasRole3) {
          member.roles.add(role3);
        }
      }
    }
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
}
