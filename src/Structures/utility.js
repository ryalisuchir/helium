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

    const commandsFiles = await globPromise(
      `${__dirname}/../Text_Commands/**/*.js`
    );
    commandsFiles.map((value) => {
      const file = require(value);
      const splitted = value.split("/");
      const directory = splitted[splitted.length - 2];

      if (file.name) {
        const properties = { directory, ...file };
        this.client.commands.set(file.name, properties);
      }
    });
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
        this.client.slashCommands.set(file.name, properties);
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
