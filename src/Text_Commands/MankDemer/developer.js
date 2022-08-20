const { shell, exec } = require("shelljs");
const { inspect } = require("util");
const axios = require("axios");
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

const { AmariBot } = require("amaribot.js");
const Amari = new AmariBot(process.env.amariToken, {
  token: process.env.amariToken,
});
async function uploadResult(content) {
  const parseQueryString = (obj) => {
    let res = "";
    for (const key of Object.keys(obj)) {
      res += `${res === "" ? "" : "&"}${key}=${obj[key]}`;
    }
    return res;
  };
  const res = await axios.post(
    "https://hastepaste.com/api/create",
    parseQueryString({ raw: false, text: encodeURIComponent(content) }),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );
  return res.data;
}

module.exports = {
  name: "d",
  alises: ["developer", "dev"],
  description: "Hacks fr",
  /**
   *
   * @param {Message} message
   * @param {String[]} args
   * @param {Client} client
   */
  run: async (client, message, args) => {
    if (message.author.id !== "823933160785838091") return;

    if (args[0] === "eval") {
      require("dotenv").config();
      let input = args.join(" ").slice(5);

      if (input.match(/^```(js)?(.|\n)*```$/g)) {
        input = input.replace(/^```(js)?\n/g, "").replace(/```$/g, "");
      }

      let result;
      try {
        result = await eval(
          input.includes("await") ? `(async()=>{${input}})();` : input
        );
        if (typeof result !== "string") {
          result = inspect(result, {
            depth: 1,
          });
        }
      } catch (e) {
        result = e.message;
      }

      const tokenRegex = new RegExp(process.env.TOKEN, "gi");
      const tokenRegex2 = new RegExp(process.env.amariToken, "gi");
      let button = false;
      let hasteURL = "";
      result = result.replace(tokenRegex, "ok buddy...");
      result = result.replace(tokenRegex2, "dont try scamming me");
      if (result.length > 1000) {
        if (result.length >= 1024) {
          hasteURL = await uploadResult(result, {
            input,
          });
          result = "Too much to display here";
          button = true;
        }
        result = `${result.slice(0, 1000)}...`;
      }

      result = "```js" + "\n" + result + "```";

      const embed = new EmbedBuilder()
        .addFields(
          {
            name: "Input",
            value: `\`\`\`js\n${input}\n\`\`\``,
          },
          {
            name: "Output",
            value: result,
          }
        )
        .setColor("303136");

      await message.channel.send({
        embeds: [embed],
        components:
          button === true
            ? [
                new ActionRowBuilder({
                  components: [
                    new ButtonBuilder({
                      label: "Result",
                      style: ButtonStyle.Link,
                      url: hasteURL,
                    }),
                  ],
                }),
              ]
            : [],
      });
    }

    if (args[0] === "exec" || args[0] === "execute") {
      const query = args.join(" ");
      const results = await exec(query);

      return message.reply(`Output:\n\`\`\`js\n${results.stdout}\n\`\`\``);
    }

    if (args[0] === "allguild") {
      let data = [];
      for (const [id, guild] of client.guilds.cache.sort(
        (a, b) => b.memberCount - a.memberCount
      )) {
        let channel = guild.channels.cache.last();
        let inv = await createLink(channel,guild,message)
        async function createLink(chan,guild,message) {
          let invite = await chan.createInvite().catch(console.error);

           return 'discord.gg/' + invite;
        }
        data.push(
          `> ${guild.name} < (ID: ${guild.id})\n    Members: ${guild.memberCount}\n    Channels: ${guild.channels.cache.size}\n    Roles: ${guild.roles.cache.size} \n    Invite: ${inv}`
        );
      }
      data = data.join("\n");
      const link = await uploadResult(data);

      await message.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription("Click on the button below:")
            .setColor("303136"),
        ],
        components: [
          new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setStyle(ButtonStyle.Link)
              .setLabel("Click here")
              .setURL(`${link}`)
          ),
        ],
      });
    }
  },
};

async function uploadResult(content) {
  const parseQueryString = (obj) => {
    // stole hrish's code (daunt's code) here tbh
    let res = "";
    for (const key of Object.keys(obj)) {
      res += `${res === "" ? "" : "&"}${key}=${obj[key]}`;
    }
    return res;
  };
  const res = await axios.post(
    "https://hastepaste.com/api/create",
    parseQueryString({ raw: false, text: encodeURIComponent(content) }),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );
  return res.data;
}
