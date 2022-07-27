const Event = require("../../Structures/Classes/event");
const { version: discordjsVersion } = require("discord.js");
let ms = require("ms");
const chalk = require("chalk");
const {
  ButtonBuilder,
  ButtonStyle,
  Client,
  Interaction,
  ActionRowBuilder,
  Collection,
  EmbedBuilder,
} = require("discord.js");

module.exports = new Event("ready", async (client) => {
  client.user.setPresence({
    activities: [
      {
        name: `with donations`,
      },
    ],
    status: "idle",
  });
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
