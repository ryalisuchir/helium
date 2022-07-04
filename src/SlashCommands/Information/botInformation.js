const { EmbedBuilder, ApplicationCommandType } = require("discord.js");
const os = require("os");

module.exports = {
  name: "botinformation",
  description: "Shows essential information about the bot.",
  type: ApplicationCommandType.ChatInput,
  /**
   * @param {Client} client
   * @param {Interaction} interaction
   * @param {String[]} args
   */
  run: async (client, interaction, args) => {
    let createdAt = Math.round(client.user.createdTimestamp / 1000);
    let totalram = (os.totalmem() / 10 ** 6 + " ").split(".")[0];
    const freeram = (os.freemem() / 10 ** 6 + " ").split(".")[0];
    const usedram = ((os.totalmem() - os.freemem()) / 10 ** 6 + " ").split(
      "."
    )[0];
    let informationEmbed = new EmbedBuilder()
      .setTitle(`Helium's Information`)
      .setDescription(
        ` > **Latency:**
\`\`\`yaml\n${client.ws.ping} ms\`\`\`
> **Process Information:**
\`\`\`yaml\n
Total Memory : ${totalram} MB
Used Memory  : ${usedram} MB
Free Memory  : ${freeram} MB
- HeapTotal  : ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB
\`\`\`
> **Bot Created:** <t:${createdAt}:R>`
      )
      .setColor("303136");

    interaction.reply({
      embeds: [informationEmbed],
    });
  },
};
