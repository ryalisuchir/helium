const {
  EmbedBuilder,
  ApplicationCommandType,
  ApplicationCommandOptionType,
} = require("discord.js");
const curDB = require("../../Schemas/currencySchema");

module.exports = {
  name: "balance",
  description: "Shows the balance of a specific user.",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "user",
      description: "The user's balance you are checking.",
      type: ApplicationCommandOptionType.User,
      required: false,
    },
  ],
  /**
   * @param {CommandInteraction} interaction
   */
  run: async (client, interaction, args) => {
    if (!interaction.user.id === "823933160785838091")
      return interaction.reply({
        content: "Coming soon...",
      });

    let statisticsInformation = {
      user: interaction.options.getUser("user") || interaction.user,
    };

    let cDB = await curDB.findOne({ userID: statisticsInformation.user.id });
    if (!cDB) {
      cDB = new curDB({
        userID: statisticsInformation.user.id,
        wallet: 0,
        balance: 0,
        bank: 0,
        bankLimit: 1000000,
        commands: 1,
      });
      await cDB.save().catch((err) => console.log(err));
    }
    if (!cDB.wallet) cDB.wallet = 0;
    if (!cDB.bank) cDB.bank = 0;
    if (!cDB.bankLimit) cDB.bankLimit = 1000000;
    if (!cDB.balance) cDB.balance = 0;
    cDB.commands += 1;
    await cDB.save().catch((err) => console.log(err));

    const balanceEmbed = new EmbedBuilder()
      .setTitle(`${statisticsInformation.user.username}'s Balance`)
      .setDescription(
        `**Points Balance:** ${cDB.balance.toLocaleString()}
**Wallet:** $${cDB.wallet.toLocaleString()}
**Bank:** $${cDB.bank.toLocaleString()} / $${cDB.bankLimit.toLocaleString()}`
      )
      .setColor("303136");
    await interaction
      .reply({
        embeds: [balanceEmbed],
      })
      .catch((err) => console.log(err));
  },
};
