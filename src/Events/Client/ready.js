const Event = require("../../Structures/Classes/event");
const { version: discordjsVersion } = require("discord.js");
const { weeklyDonations } = require("../../Schemas/weeklyDonationSchema");
const giveawayModel = require("../../Schemas/giveawaySchema");
let ms = require("ms");
const chalk = require("chalk");
const cron = require("cron");
const {
  ButtonBuilder,
  ButtonStyle,
  Client,
  Interaction,
  ActionRowBuilder,
  Collection,
  EmbedBuilder,
} = require("discord.js");
const entries = new Collection();

module.exports = new Event("ready", async (client) => {
  gawCounter1++;
  let scheduledMessage = new cron.CronJob("0 0 * * 0", async () => {
    let wSchema;
    wSchema = await weeklyDonations.findOneAndDelete({
      userID: {},
    });
  });
  client.user.setPresence({
    activities: [
      {
        name: `with donations`,
      },
    ],
    status: "idle",
  });
  setInterval(async function () {
    if (gawCounter1 > 5) {
      gawCounter1 = 0;

      const Query = await giveawayModel.find({
        hasEnded: false,
        endsAt: {
          $lt: new Date().getTime(),
        },
      });
      for (const giveaway of Query) {
        if (processing.has(giveaway.messageId)) continue;

        processing.set(giveaway.messageId, "x");

        try {
          const channel = client.channels.cache.get(giveaway.channelId);

          if (channel) {
            try {
              const message = await channel.messages.fetch(giveaway.messageId);

              if (message) {
                let winners = [];
                if (giveaway.winners > 1) {
                  for (i = 0; i < giveaway.winners; i++) {
                    winners.push(
                      giveaway.entries.filter((val) => !winners.includes(val))[
                        Math.floor(
                          Math.random() *
                            giveaway.entries.filter(
                              (val) => !winners.includes(val)
                            ).length
                        )
                      ]
                    );
                  }
                } else {
                  winners = [
                    giveaway.entries[
                      Math.floor(Math.random() * giveaway.entries.length)
                    ],
                  ];
                }

                giveaway.WWinners = winners;
                winners = winners.map((a) => `<@${a}>`).join(" ");

                message.edit({
                  content: `🎉 Giveaway Ended 🎉`,
                  embeds: [
                    new MessageEmbed()
                      .setTitle(giveaway.prize)
                      .setFooter({
                        text: `Winners: ${giveaway.winners} | Ended at`,
                      })
                      .setTimestamp()
                      .setColor("303136")
                      .setDescription(
                        `Winner(s): ${winners}\nHost: <@${giveaway.hosterId}>`
                      ),
                  ],
                  components: [
                    new ActionRowBuilder().addComponents([
                      new ButtonBuilder()
                        .setEmoji({
                          name: "CZ_giveaway",
                          id: "905181806922461214",
                        })
                        .setCustomId("giveaway-join")
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(),
                    ]),
                  ],
                });

                message.channel.send({
                  content: `${winners}\nYou have won the giveaway for **${giveaway.prize}**.`,
                  components: [
                    new ActionRowBuilder().addComponents([
                      new ButtonBuilder()
                        .setLabel("Jump")
                        .setStyle(ButtonStyle.Link)
                        .setURL(
                          `https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}`
                        ),
                      new ButtonBuilder()
                        .setLabel("Reroll")
                        .setCustomId("giveaway-reroll")
                        .setStyle(ButtonStyle.Secondary),
                    ]),
                  ],
                });

                try {
                  (await client.users.fetch(giveaway.hosterId)).send({
                    embeds: [
                      new EmbedBuilder()
                        .setTitle("A giveaway you hosted has finished...")
                        .setDescription(
                          `Your giveaway for \`${giveaway.prize}\` has ended.`
                        )
                        .addFields(
                          {
                            name: "Giveaway Link",
                            value: `[Jump](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})`,
                            inline: true,
                          },
                          { name: "Winners", value: `${winners}`, inline: true }
                        )
                        .setTimestamp()
                        .setColor("303136"),
                    ],
                  });
                } catch (err) {
                  console.log(err);
                }

                processing.delete(giveaway.messageId);
                giveaway.hasEnded = true;
                giveaway.save();
                continue;
              }
            } catch (err) {
              console.log(err);
            }
          }
        } catch (err) {
          console.log(err);
        }
      }
    }
  }, 1000);
  ``;

  console.log(chalk.red.bold("——————————[ Client Statistics ]——————————"));
  console.log(
    chalk.gray("꒱ Connected To"),
    chalk.cyan.bold(`${client.user.tag} ៸៸`)
  );
  console.log(chalk.gray(`Default Prefix:` + chalk.red(` ${client.prefix}`)));
  console.log(
    chalk.gray("꒱ Watching"),
    chalk.red(`${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)}`),
    chalk.gray(
      `${
        client.guilds.cache.reduce((a, b) => a + b.memberCount, 0) > 1
          ? "Users ||"
          : "User ||"
      }`
    ),
    chalk.red(`${client.guilds.cache.size}`),
    chalk.gray(`${client.guilds.cache.size > 1 ? "Servers ៸៸" : "Server ៸៸"}`)
  );
  console.log("");
  console.log(chalk.red.bold("——————————[ System Statistics ]——————————"));

  console.log(chalk.gray(`Running on:`), chalk.white(`${process.version}`));
  console.log(
    chalk.gray(`Platform:`),
    chalk.white(`${process.platform} ${process.arch}`)
  );
  console.log(
    chalk.gray(`Memory:`),
    chalk.white(
      `${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB RSS`
    ),
    chalk.gray(" + "),
    chalk.white(
      `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} Heap`
    )
  );
  console.log(chalk.gray("Discord.js:"), chalk.white(`v${discordjsVersion}`));
  console.log(
    chalk.white(
      `${ms(ms(Math.round(process.uptime() - client.uptime / 1000) + "s"))}`
    ),
    chalk.gray(`to load the bot.`)
  );
  console.log(chalk.red.bold("——————————————————————————————————————————"));
  //
});
