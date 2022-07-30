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
  name: "leaderboard",
  description:
    "Check the leaderboard for donations and managers in a specific guild.",
  type: ApplicationCommandType.ChatInput,
  category: "ServerConfiguration",
  options: [
    {
      name: "donations",
      description: "A leaderboard for donations in a specific guild.",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "type",
          description: "The type of donation in the leaderboard.",
          type: ApplicationCommandOptionType.String,
          autocomplete: true,
          required: true,
        },
      ],
    },
    {
      name: "managers",
      description:
        "A leaderboard for the most active managers in a specific guild.",
      type: ApplicationCommandOptionType.Subcommand,
    },
  ],
  /**
   * @param {CommandInteraction} interaction
   */
  run: async (client, interaction, args) => {
    let subcommand = interaction.options.getSubcommand();

    if (subcommand === "donations") {
      if (
        interaction.options.getString("type") !== "all" &&
        interaction.options.getString("type") !== "event" &&
        interaction.options.getString("type") !== "heist" &&
        interaction.options.getString("type") !== "giveaway" &&
        interaction.options.getString("type") !== "1k event"
      ) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription("Please choose from the autocomplete options.")
              .setColor("303136"),
          ],
          ephemeral: true,
        });
      }
      let find = await donationSchema.find({ guildID: interaction.guild.id });

      if (!find) {
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                "No one in this guild has donated yet, or it has not been cached."
              )
              .setColor("303136"),
          ],
        });
      }
      let autocomplete = interaction.options.getString("type");
      let desc;
      let place;
      if (autocomplete === "all") {
        find = find
          .filter((value) => interaction.guild.members.cache.get(value.userID))
          .filter((u) => !u.bot)
          .sort((a, b) => {
            return (
              b.donations.event +
              b.donations.giveaway +
              b.donations.heist -
              (a.donations.event + a.donations.giveaway + a.donations.heist)
            );
          });

        let top;
        if (!isNaN(args[0])) {
          top = args[0];
        } else {
          if (args[0] !== "all") {
            top = 10;
          } else {
            top = find.length;
          }
        }

        let mapped = find.map((value, index) => {
          return `\`(#${index + 1})\` ${
            client.users.cache.get(value.userID).tag
          }: ⏣ **${(
            value.donations.event +
            value.donations.giveaway +
            value.donations.heist
          ).toLocaleString()}**`;
        });

        let test = mapped.filter((value) => {
          return value.includes(interaction.user.tag);
        });

        place = test.join().slice(3, 4).toLocaleString();

        desc = mapped
          .slice(0, top)
          .join("\n")
          .replace("`(#1)`", `<:onenew:995023672215613530> `)
          .replace("`(#2)`", `<:twonew:995023774565011497> `)
          .replace("`(#3)`", `<:threenew:995023782823604234> `)
          .replace("`(#4)`", `<a:sahadyellow:973374838519509083> `)
          .replace("`(#5)`", `<a:sahadyellow:973374838519509083> `)
          .replace("`(#6)`", `<a:sahadyellow:973374838519509083> `)
          .replace("`(#7)`", `<a:sahadyellow:973374838519509083> `)
          .replace("`(#8)`", `<a:sahadyellow:973374838519509083> `)
          .replace("`(#9)`", `<a:sahadyellow:973374838519509083> `)
          .replace("`(#10)`", `<a:sahadyellow:973374838519509083> `)
          .replace("ٴ", "");
      }
      if (autocomplete === "event") {
        find = find
          .filter((value) => interaction.guild.members.cache.get(value.userID))
          .filter((u) => !u.bot)
          .sort((a, b) => {
            return b.donations.event - a.donations.event;
          });

        let top;
        if (!isNaN(args[0])) {
          top = args[0];
        } else {
          if (args[0] !== "all") {
            top = 10;
          } else {
            top = find.length;
          }
        }

        let mapped = find.map((value, index) => {
          return `\`(#${index + 1})\` ${
            client.users.cache.get(value.userID).tag
          }: ⏣ **${value.donations.event}**`;
        });

        let test = mapped.filter((value) => {
          return value.includes(interaction.user.tag);
        });

        place = test.join().slice(3, 4).toLocaleString();

        desc = mapped
          .slice(0, top)
          .join("\n")
          .replace("`(#1)`", `<:onenew:995023672215613530> `)
          .replace("`(#2)`", `<:twonew:995023774565011497> `)
          .replace("`(#3)`", `<:threenew:995023782823604234> `)
          .replace("`(#4)`", `<a:sahadyellow:973374838519509083> `)
          .replace("`(#5)`", `<a:sahadyellow:973374838519509083> `)
          .replace("`(#6)`", `<a:sahadyellow:973374838519509083> `)
          .replace("`(#7)`", `<a:sahadyellow:973374838519509083> `)
          .replace("`(#8)`", `<a:sahadyellow:973374838519509083> `)
          .replace("`(#9)`", `<a:sahadyellow:973374838519509083> `)
          .replace("`(#10)`", `<a:sahadyellow:973374838519509083> `)
          .replace("ٴ", "");
      }

      if (autocomplete === "heist") {
        find = find
          .filter((value) => interaction.guild.members.cache.get(value.userID))
          .filter((u) => !u.bot)
          .sort((a, b) => {
            return b.donations.heist - a.donations.heist;
          });

        let top;
        if (!isNaN(args[0])) {
          top = args[0];
        } else {
          if (args[0] !== "all") {
            top = 10;
          } else {
            top = find.length;
          }
        }

        let mapped = find.map((value, index) => {
          return `\`(#${index + 1})\` ${
            client.users.cache.get(value.userID).tag
          }: ⏣ **${value.donations.heist}**`;
        });

        let test = mapped.filter((value) => {
          return value.includes(interaction.user.tag);
        });

        place = test.join().slice(3, 4).toLocaleString();

        desc = mapped
          .slice(0, top)
          .join("\n")
          .replace("`(#1)`", `<:onenew:995023672215613530> `)
          .replace("`(#2)`", `<:twonew:995023774565011497> `)
          .replace("`(#3)`", `<:threenew:995023782823604234> `)
          .replace("`(#4)`", `<a:sahadyellow:973374838519509083> `)
          .replace("`(#5)`", `<a:sahadyellow:973374838519509083> `)
          .replace("`(#6)`", `<a:sahadyellow:973374838519509083> `)
          .replace("`(#7)`", `<a:sahadyellow:973374838519509083> `)
          .replace("`(#8)`", `<a:sahadyellow:973374838519509083> `)
          .replace("`(#9)`", `<a:sahadyellow:973374838519509083> `)
          .replace("`(#10)`", `<a:sahadyellow:973374838519509083> `)
          .replace("ٴ", "");
      }
      if (autocomplete === "giveaway") {
        find = find
          .filter((value) => interaction.guild.members.cache.get(value.userID))
          .filter((u) => !u.bot)
          .sort((a, b) => {
            return b.donations.giveaway - a.donations.giveaway;
          });

        let top;
        if (!isNaN(args[0])) {
          top = args[0];
        } else {
          if (args[0] !== "all") {
            top = 10;
          } else {
            top = find.length;
          }
        }

        let mapped = find.map((value, index) => {
          return `\`(#${index + 1})\` ${
            client.users.cache.get(value.userID).tag
          }: ⏣ **${value.donations.giveaway}**`;
        });

        let test = mapped.filter((value) => {
          return value.includes(interaction.user.tag);
        });

        place = test.join().slice(3, 4).toLocaleString();

        desc = mapped
          .slice(0, top)
          .join("\n")
          .replace("`(#1)`", `<:onenew:995023672215613530> `)
          .replace("`(#2)`", `<:twonew:995023774565011497> `)
          .replace("`(#3)`", `<:threenew:995023782823604234> `)
          .replace("`(#4)`", `<a:sahadyellow:973374838519509083> `)
          .replace("`(#5)`", `<a:sahadyellow:973374838519509083> `)
          .replace("`(#6)`", `<a:sahadyellow:973374838519509083> `)
          .replace("`(#7)`", `<a:sahadyellow:973374838519509083> `)
          .replace("`(#8)`", `<a:sahadyellow:973374838519509083> `)
          .replace("`(#9)`", `<a:sahadyellow:973374838519509083> `)
          .replace("`(#10)`", `<a:sahadyellow:973374838519509083> `)
          .replace("ٴ", "");
      }

      if (autocomplete === "1k event") {
        find = find
          .filter((value) => interaction.guild.members.cache.get(value.userID))
          .filter((u) => !u.bot)
          .sort((a, b) => {
            return (
              b.onethousand.event +
              b.onethousand.giveaway +
              b.onethousand.heist -
              (a.onethousand.event +
                a.onethousand.giveaway +
                a.onethousand.heist)
            );
          });

        let top;
        if (!isNaN(args[0])) {
          top = args[0];
        } else {
          if (args[0] !== "all") {
            top = 10;
          } else {
            top = find.length;
          }
        }

        let mapped = find.map((value, index) => {
          return `\`(#${index + 1})\` ${
            client.users.cache.get(value.userID).tag
          }: ⏣ **${(
            value.onethousand.event +
            value.onethousand.giveaway +
            value.onethousand.heist
          ).toLocaleString()}**`;
        });

        let test = mapped.filter((value) => {
          return value.includes(interaction.user.tag);
        });

        place = test.join().slice(3, 4).toLocaleString();

        desc = mapped
          .slice(0, top)
          .join("\n")
          .replace("`(#1)`", `<:onenew:995023672215613530> `)
          .replace("`(#2)`", `<:twonew:995023774565011497> `)
          .replace("`(#3)`", `<:threenew:995023782823604234> `)
          .replace("`(#4)`", `<a:sahadyellow:973374838519509083> `)
          .replace("`(#5)`", `<a:sahadyellow:973374838519509083> `)
          .replace("`(#6)`", `<a:sahadyellow:973374838519509083> `)
          .replace("`(#7)`", `<a:sahadyellow:973374838519509083> `)
          .replace("`(#8)`", `<a:sahadyellow:973374838519509083> `)
          .replace("`(#9)`", `<a:sahadyellow:973374838519509083> `)
          .replace("`(#10)`", `<a:sahadyellow:973374838519509083> `)
          .replace("ٴ", "");
      }

      let leaderBoardEmbed = new EmbedBuilder()
        .setTitle(`Leaderboard Donations (${autocomplete})`)
        .setDescription(
          `> \`(#${place})\` - ${interaction.user.tag}\n\n${desc}`
        )
        .setColor("303136");

      interaction.reply({ embeds: [leaderBoardEmbed] });
    } else if (subcommand === "managers") {
      let find = await donationSchema.find({ guildID: interaction.guild.id });

      find = find
        .filter((value) => interaction.guild.members.cache.get(value.userID))
        .filter((u) => !u.bot)
        .sort((a, b) => {
          return (
            b.timesAccepted.event +
            b.timesAccepted.giveaway +
            b.timesAccepted.heist -
            (a.timesAccepted.event +
              a.timesAccepted.giveaway +
              a.timesAccepted.heist)
          );
        });

      let top = 10;

      let mapped = find.map((value, index) => {
        return `\`(#${index + 1})\` ${
          client.users.cache.get(value.userID).tag
        }: **${(
          value.timesAccepted.event +
          value.timesAccepted.giveaway +
          value.timesAccepted.heist
        ).toLocaleString()}** accepted`;
      });

      let test = mapped.filter((value) => {
        return value.includes(interaction.user.tag);
      });

      let place = test.join().slice(3, 4).toLocaleString();

      let desc = mapped
        .slice(0, top)
        .join("\n")
        .replace("`(#1)`", `<:onenew:995023672215613530> `)
        .replace("`(#2)`", `<:twonew:995023774565011497> `)
        .replace("`(#3)`", `<:threenew:995023782823604234> `)
        .replace("`(#4)`", `<a:sahadyellow:973374838519509083> `)
        .replace("`(#5)`", `<a:sahadyellow:973374838519509083> `)
        .replace("`(#6)`", `<a:sahadyellow:973374838519509083> `)
        .replace("`(#7)`", `<a:sahadyellow:973374838519509083> `)
        .replace("`(#8)`", `<a:sahadyellow:973374838519509083> `)
        .replace("`(#9)`", `<a:sahadyellow:973374838519509083> `)
        .replace("`(#10)`", `<a:sahadyellow:973374838519509083> `)
        .replace("ٴ", "");

      let leaderBoardEmbed = new EmbedBuilder()
        .setTitle(`THIS IS A BUG, AND DOES NOT SHOW ALL USERS - BEING FIXED`)
        .setDescription(
          `> \`(#${place})\` - ${interaction.user.tag}\n\n${desc}`
        )
        .setColor("303136");

      interaction.reply({ embeds: [leaderBoardEmbed] });
    }
  },
};
