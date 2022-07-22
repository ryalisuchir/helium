const {
  EmbedBuilder,
  ApplicationCommandType,
  ApplicationCommandOptionType,
} = require("discord.js");
const curDB = require("../../Schemas/currencySchema");
const humanizeDuration = require("humanize-duration");

module.exports = {
  name: "beg",
  description: "Beg for money.",
  type: ApplicationCommandType.ChatInput,

  /**
   * @param {CommandInteraction} interaction
   */
  run: async (client, interaction, args) => {
    if (!interaction.user.id === "823933160785838091")
      return interaction.reply({
        content: "Coming soon...",
      });

    let giveVal = Math.floor(Math.random() * (500 - 150 + 1) + 150);
    let cooldown = 10000;
    let cup = "beggarscup";
    let hasCup = false;

    let cDB = await curDB.findOne({ userID: interaction.user.id });
    if (cDB) {
      let lastBeg = cDB.begCD;
      if (lastBeg !== null && cooldown - (Date.now() - lastBeg) > 0) {
        let timeObj = humanizeDuration(cooldown - (Date.now() - lastBeg), {
          round: true,
        });
        return interaction.reply({
          embeds: [
            new EmbedBuilder().setDescription(
              `You must wait **${timeObj}** before begging again.`
            ),
          ],
        });
      } else {
        let success = Math.floor(Math.random() * 11);

        let userInv = cDB.inventory;
        let cupCheck = userInv.find(({ itemID }) => itemID === cup);
        if (cupCheck !== undefined) hasCup = true;
        if (hasCup) giveVal = giveVal * 2;
        if (success <= 2) {
          cDB.begCD = Date.now();
          await cDB.save().catch((err) => console.log(err));
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription(`You begged and did not receive anything...`)
                .setColor("303136"),
            ],
          });
        }
        if (isNaN(cDB.wallet)) {
          cDB.wallet = giveVal;
        } else {
          cDB.wallet += giveVal;
        }
        cDB.begCD = Date.now();
        cDB.commands += 1;
        await cDB.save().catch((err) => console.log(err));

        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `You begged and convinced someone to spare you $${giveVal}. Pathetic.`
              )
              .setColor("303136"),
          ],
        });
      }
    } else {
      cDB = new curDB({
        userID: interaction.user.id,
        balance: 0,
        wallet: 0,
        commands: 0,
        begCD: Date.now(),
      });
      await cDB.save().catch((err) => console.log(err));
      let success = Math.floor(Math.random() * 11);
      if (success <= 3) {
        cDB.begCD = Date.now();
        await cDB.save().catch((err) => console.log(err));
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(`You begged and did not receive anything...`)
              .setColor("303136"),
          ],
        });
      }

      cDB.wallet = giveVal;
      cDB.begCD = Date.now();
      cDB.commands += 1;
      await await cDB.save().catch((err) => console.log(err));
      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `You begged and convinced someone to spare you $${giveVal}. Pathetic.`
            )
            .setColor("303136"),
        ],
      });
    }
  },
};
