const {
  EmbedBuilder,
  ApplicationCommandType,
  ApplicationCommandOptionType,
} = require("discord.js");
const curDB = require("../../Schemas/currencySchema");
const itemDB = require("../../Schemas/itemSchema");
const humanizeDuration = require("humanize-duration");
const FuzzySearch = require("fuzzy-search");

module.exports = {
  name: "buy",
  description: "Buy an item.",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "item",
      description: "The item you are buying.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "amount",
      description: "The amount of the item you are buying.",
      type: ApplicationCommandOptionType.Integer,
      required: false,
    },
  ],

  /**
   * @param {CommandInteraction} interaction
   */
  run: async (client, interaction, args) => {
    let buyingInformation = {
      item: interaction.options.getString("item"),
      amount: interaction.options.getInteger("amount") || 1,
    };

    let givenID = buyingInformation.item;
    let giveVal = buyingInformation.amount;

    if (givenID.length < 2)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription("That item doesn't exist...")
            .setColor("303136"),
        ],
        ephemeral: true,
      });
    let cDB = await curDB.findOne({ userID: interaction.user.id });
    const items = await itemDB.find({});
    const searcher = new FuzzySearch(items, ["itemID"], {
      caseSensitive: false,
      sort: true,
    });
    const result = searcher.search(givenID);
    let iDB = await itemDB.findOne({ itemID: result[0].itemID });
    if (!iDB)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription("I'm afraid that's not a valid item...")
            .setColor("303136"),
        ],
        ephemeral: true,
      });
    const buyPrice = iDB.buyPrice;
    if (buyPrice === undefined)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription("You cannot buy this item.")
            .setColor("303136"),
        ],
        ephemeral: true,
      });
    if (cDB) {
      const userItems = cDB.inventory;
      let item = userItems.find(({ itemID }) => itemID === result[0].itemID);
      const itemIndex = userItems.findIndex(
        ({ itemID }) => itemID === result[0].itemID
      );
      if (item !== undefined) {
        if (item.count === iDB.itemLimit)
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription(
                  `You cannot purchase more than ${iDB.itemLimit} of this item.`
                )
                .setColor("303136"),
            ],
            ephemeral: true,
          });
      }
      if (cDB.wallet < iDB.buyPrice * giveVal || cDB.wallet === undefined) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `You don't have enough money to buy this, don't try to scam me.`
              )
              .setColor("303136"),
          ],
          ephemeral: true,
        });
      } else if (item === undefined) {
        if (giveVal > iDB.itemLimit)
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription(`You may only have ${iDB.itemLimit} of these.`)
                .setColor("303136"),
            ],
            ephemeral: true,
          });

        cDB.inventory.push({
          itemName: iDB.itemName,
          itemID: iDB.itemID,
          userID: interaction.user.id,
          count: giveVal,
        });
        if (cDB.wallet >= iDB.buyPrice * giveVal) {
          cDB.wallet -= Number(buyPrice * giveVal);
        }
        if (iDB.attack) cDB.stats.attack += iDB.attack;
        if (iDB.wisdom) cDB.stats.wisdom += iDB.wisdom;
        if (iDB.dexterity) cDB.stats.dexterity += iDB.dexterity;
      } else {
        cDB.inventory[itemIndex].count += Number(giveVal);
        if (cDB.wallet >= iDB.buyPrice * giveVal) {
          cDB.wallet -= Number(buyPrice * giveVal);
        }
      }

      cDB.commands += 1;
      await cDB.save().catch((err) => console.log(err));
      await interaction
        .reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `You successfully bought ${Number(giveVal).toLocaleString()} ${
                  iDB.itemName
                } for $${(buyPrice * giveVal).toLocaleString()}!`
              )
              .setColor("303136"),
          ],
          ephemeral: true,
        })
        .catch((err) => console.log(err));
    } else {
      cDB = new curDB({
        userID: interaction.user.id,
        balance: 0,
        wallet: 0,
        commands: 0,
      });
      await cDB.save().catch((err) => console.log(err));

      await interaction
        .reply({
          embeds: [
            new EmbedBuilder()
              .setColor("303136")
              .setDescription(
                `You don't have enough money to buy this item, don't try to scam me.`
              ),
          ],
          ephemeral: true,
        })
        .catch((err) => console.log(err));
    }
  },
};
