process.traceDeprecation = true;
const client = require("./client");
const { promisify } = require("util");

const { glob } = require("glob");
const globPromise = require("util").promisify(glob);

const mongoose = require("mongoose");
const chalk = require("chalk");
let ms = require("ms");
const { version: discordjsVersion } = require("discord.js");
const Command = require("./Classes/command");
const SlashCommand = require("./Classes/slashCommand");
const ContextCommand = require("./Classes/contextCommand");
const Event = require("./Classes/event");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const fs = require("node:fs");

class utilityFunction {
  constructor(client) {
    this.client = client;
  }

  async startClient() {
    this.client.login(process.env["TOKEN"]);

    const commandFiles = await globPromise(
      `${__dirname}/../SlashCommands/**/*.js`
    );

    commandFiles.map((value) => {
      /**
       * @type {Command}
       */
      const file = require(value);
      const splitted = value.split("/");
      const directory = splitted[splitted.length - 2];

      if (file.name) {
        const properties = { directory, ...file };
        this.client.commands.set(file.name, properties);
      }
    });

    // Events
    const eventFiles = await globPromise(`${__dirname}/../Events/**/*.js`);
    eventFiles.map((value) => {
      /**
       * @type {Event}
       */
      let file = require(value);
      this.client.on(file.event, file.run);
    });

    /**
     * @param {Client} client
     */

    const slashCommands = await globPromise(
      `${__dirname}/../SlashCommands/**/*.js`
    );

    const arrayOfSlashCommands = [];

    slashCommands.map((value) => {
      const file = require(value);
      if (!file.name) return;
      this.client.slashCommands.set(file.name, file);
      if (["MESSAGE", "USER"].includes(file.type)) delete file.description;
      arrayOfSlashCommands.push(file);
    });
    const rest = new REST({ version: "9" }).setToken(process.env["TOKEN"]);

    (async () => {
      try {
        console.log("Started refreshing application (/) commands.");

        await rest.put(Routes.applicationCommands("958848741790609468"), {
          body: arrayOfSlashCommands,
        });

        console.log("Successfully reloaded application (/) commands.");
      } catch (error) {
        console.error(error);
      }
    })();

    this.client.on("ready", async () => {
      await this.client.slashCommands.set(arrayOfSlashCommands);
      //
      console.log(chalk.red.bold("——————————[ Client Statistics ]——————————"));
      console.log(
        chalk.gray("꒱ Connected To"),
        chalk.cyan.bold(`${this.client.user.tag} ៸៸`)
      );
      console.log(
        chalk.gray(
          `Default Prefix:` + chalk.red(` ${this.client.config.prefix}`)
        )
      );
      console.log(
        chalk.gray("꒱ Watching"),
        chalk.red(
          `${this.client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)}`
        ),
        chalk.gray(
          `${
            this.client.guilds.cache.reduce((a, b) => a + b.memberCount, 0) > 1
              ? "Users ||"
              : "User ||"
          }`
        ),
        chalk.red(`${this.client.guilds.cache.size}`),
        chalk.gray(
          `${this.client.guilds.cache.size > 1 ? "Servers ៸៸" : "Server ៸៸"}`
        )
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
      console.log(
        chalk.gray("Discord.js:"),
        chalk.white(`v${discordjsVersion}`)
      );
      console.log(
        chalk.white(
          `${ms(
            ms(Math.round(process.uptime() - this.client.uptime / 1000) + "s")
          )}`
        ),
        chalk.gray(`to load the bot.`)
      );
      console.log(chalk.red.bold("——————————————————————————————————————————"));
      //
    });
    mongoose.connect(`${process.env["MONGO_URI"]}`, { useNewUrlParser: true });
    const mongoDB = mongoose.connection;
    mongoDB.on(
      "error",
      console.error.bind(console, "[ ConnectionError via Mongo ]")
    );
    mongoDB.once("open", function () {
      console.log(
        chalk.white("[ "),
        chalk.red.bold("Database"),
        chalk.white(" ]"),
        chalk.gray(":"),
        chalk.white(`Connected to MongoDB.`)
      );
      //Connected to MongoDB!!
    });
  }
}
module.exports = utilityFunction;
