const {
  EmbedBuilder,
  ApplicationCommandType,
  ApplicationCommandOptionType,
} = require("discord.js");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

module.exports = {
  name: "howgay",
  description: "A randomizer for the howgay command..",
  type: ApplicationCommandType.ChatInput,
  category: "MankDemer",
  /**
   * @param {CommandInteraction} interaction
   */
  run: async (client, interaction, args) => {
    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription(
            "<a:loading_EMOTE:933199075254337566> Randomizing options..."
          )
          .setColor("303136"),
      ],
    });

    let highLow = ["High", "Low"];
    let youMe = ["You", "Me"];
    await sleep(5000);

    interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setDescription(
            `${highLow[Math.floor(Math.random() * highLow.length)]} - ${
              youMe[Math.floor(Math.random() * youMe.length)]
            }`
          )
          .setColor("303136"),
      ],
    });
  },
};
