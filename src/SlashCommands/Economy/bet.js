const {
  EmbedBuilder,
  ApplicationCommandType,
  ApplicationCommandOptionType,
} = require("discord.js");
const curDB = require("../../Schemas/currencySchema");
const itemDB = require("../../Schemas/itemSchema");
const humanizeDuration = require("humanize-duration");

module.exports = {
  name: "bet",
  description: "Bet, with the chance of losing money.",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "amount",
      description: "The amount you are betting.",
      type: ApplicationCommandOptionType.Integer,
      required: true,
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

    let betInformation = {
      amount: interaction.options.getInteger("amount"),
    };

    let bet = betInformation.amount;

    if (parseInt(betInformation.amount) === 0) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription("You can't bet nothing...")
            .setColor("303136"),
        ],
        ephemeral: true,
      });
    }

    let cooldown = 4000;
    let maximumWallet = 10000000;
    let baseMulti = 0.35;
    let skull = "revsskull";
    let hasSkull = false;
    let crown = "revscrown";
    let hasCrown = false;
    const items = await itemDB.find({});

    let cDB = await curDB.findOne({ userID: interaction.user.id });

    if (cDB) {
      let lastBet = cDB.betCD;
      if (lastBet !== null && cooldown - (Date.now() - lastBet) > 0) {
        let timeObj = humanizeDuration(cooldown - (Date.now() - lastBet), {
          round: true,
        });

        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `You must wait **${timeObj}** before betting again.`
              )
              .setColor("303136"),
          ],
          ephemeral: true,
        });
      } else {
        if (cDB.gamble === undefined) {
          cDB.gamble = { wins: 0, losses: 0, gained: 0, lost: 0 };
        }
        let userInv = cDB.inventory;
        let skullCheck = userInv.find(({ itemID }) => itemID === skull);
        if (skullCheck !== undefined) hasSkull = true;
        if (hasSkull) baseMulti += 0.1;
        let crownCheck = userInv.find(({ itemID }) => itemID === crown);
        if (crownCheck !== undefined) hasCrown = true;
        if (hasCrown) baseMulti += 0.15;
        let natureCheck = userInv.find(
          ({ itemID }) => itemID === "essenceofnature"
        );
        if (natureCheck) baseMulti += 0.05;
        let sackCheck = userInv.find(({ itemID }) => itemID === "greedysack");
        if (sackCheck) maximumWallet += 10000000;
        let wisdom = 1;
        userInv.forEach((item) => {
          let current = items.find(({ itemID }) => itemID === item.itemID);
          if (current.wisdom) {
            wisdom += current.wisdom;
          }
        });
        baseMulti += wisdom * 0.01;
        let walletBalance = cDB.wallet;
        if (walletBalance === undefined)
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription(`It seems you don't have any money to bet...`)
                .setColor("303136"),
            ],
            ephemeral: true,
          });
        if (Number(walletBalance) >= maximumWallet)
          return interaction.reply({
            embeds: [
              new EmbedBuilder().setDescription(
                "You're too loaded to gamble your money... why don't you spend some of it rather than hoarding it all?"
              ),
            ],
          });
        if (parseInt(walletBalance) === 0)
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription("You can't bet nothing...")
                .setColor("303136"),
            ],
            ephemeral: true,
          });

        bet = Number(bet);
        if (bet > 500000 || bet <= 0) {
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription("Give me a value under $500,000 and over $0.")
                .setColor("303136"),
            ],
            ephemeral: true,
          });
        }

        bet = Math.ceil(bet);
        if (bet > walletBalance)
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription("You don't have that much cash though...")
                .setColor("303136"),
            ],
            ephemeral: true,
          });
        if (bet < 50)
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription("You must bet at least $50.")
                .setColor("303136"),
            ],
            ephemeral: true,
          });
        let userRoll = Math.floor(Math.random() * 12 + 1);
        let revBotRoll = Math.floor(Math.random() * 12 + 1);
        let result;

        if (userRoll > revBotRoll) {
          result = "won";
          let randMulti = Math.random() * (2.5 - 0.5) + 0.5;
          const finalMulti = baseMulti * randMulti;
          const winAmount = Math.floor(finalMulti * bet);
          cDB.wallet += Number(winAmount);
          if (cDB.gamble.wins === undefined) {
            cDB.gamble.gained = Number(winAmount);
            cDB.gamble.wins = 1;
          } else {
            cDB.gamble.gained += Number(winAmount);
            cDB.gamble.wins += 1;
          }

          const winEmbed = new EmbedBuilder()
            .setTitle(`${interaction.user.username}'s gambling game`)
            .setDescription(
              `
You won **$${winAmount.toLocaleString()}**.
> **Percent won:** ${Math.floor(finalMulti * 100)}%
> **New Balance:** $${cDB.wallet.toLocaleString()}`
            )
            .addFields(
              {
                name: `${interaction.user.username}`,
                value: `Rolled: \`${userRoll}\``,
                inline: true,
              },
              {
                name: `Helium`,
                value: `Rolled: \`${revBotRoll}\``,
                inline: true,
              }
            )

            .setFooter({
              text: `Current Multiplier: ${Math.round(baseMulti * 100)}%`,
            })
            .setColor("#303136")
            .setTimestamp();

          interaction.reply({
            embeds: [winEmbed],
          });
        } else if (userRoll === revBotRoll) {
          result = "tied";
          const tieAmount = Math.floor(bet / 4);
          cDB.wallet -= Number(tieAmount);
          if (cDB.gamble.lost === undefined) {
            cDB.gamble.lost = Number(tieAmount);
            cDB.gamble.losses = 1;
          } else {
            cDB.gamble.lost += Number(tieAmount);
            cDB.gamble.losses += 1;
          }

          const tieEmbed = new EmbedBuilder()
            .setTitle(`${interaction.user.username}'s gambling game`)
            .setDescription(
              `
You tied... You lost **$${tieAmount.toLocaleString()}**.
> **New Balance:** $${cDB.wallet.toLocaleString()}`
            )
            .addFields(
              {
                name: `${interaction.user.username}`,
                value: `Rolled: \`${userRoll}\``,
                inline: true,
              },
              {
                name: `Helium`,
                value: `Rolled: \`${revBotRoll}\``,
                inline: true,
              }
            )

            .setFooter({
              text: `Current Multiplier: ${Math.round(baseMulti * 100)}%`,
            })
            .setColor("#fff345")
            .setTimestamp();

          interaction.reply({
            embeds: [tieEmbed],
          });
        } else {
          result = "lost";
          cDB.wallet -= bet;
          if (cDB.gamble.lost === undefined) {
            cDB.gamble.lost = Number(bet);
            cDB.gamble.losses = 1;
          } else {
            cDB.gamble.lost += Number(bet);
            cDB.gamble.losses += 1;
          }

          const loseEmbed = new EmbedBuilder()
            .setTitle(`${interaction.user.username}'s gambling game`)
            .setDescription(
              `
You lost $${bet.toLocaleString()}.
> **New Balance:** $${cDB.wallet.toLocaleString()}`
            )
            .addFields(
              {
                name: `${interaction.user.username}`,
                value: `Rolled: \`${userRoll}\``,
                inline: true,
              },
              {
                name: `Helium`,
                value: `Rolled: \`${revBotRoll}\``,
                inline: true,
              }
            )

            .setFooter({
              text: `Current Multiplier: ${Math.round(baseMulti * 100)}%`,
            })
            .setColor("#303136")
            .setTimestamp();

          interaction.reply({
            embeds: [loseEmbed],
          });
        }

        cDB.commands += 1;
        cDB.betCD = Date.now();
        await cDB.save().catch((err) => console.log(err));
      }
    }
  },
};
