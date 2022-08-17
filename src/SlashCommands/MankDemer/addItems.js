const {
  EmbedBuilder,
  ApplicationCommandType,
  ApplicationCommandOptionType,
} = require("discord.js");
const db = require("../../Schemas/MankDemer/itemsSchema");

module.exports = {
  name: "additem",
  description: "Add an item to the database.",
  type: ApplicationCommandType.ChatInput,
  category: "MankDemer",
  options: [
    {
      name: "item_id",
      description: "The ID of the item you are adding to the DB.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "item_value",
      description: "The donation value of the item you are adding to the DB.",
      type: ApplicationCommandOptionType.Integer,
      required: true,
    },
    {
      name: "item_type",
      description: "The type of the item you are adding to the DB.",
      type: ApplicationCommandOptionType.String,
      autocomplete: true,
      required: true,
    },
    {
      name: "item_emoji",
      description: "The emoji of the item you are adding to the DB.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "thumbnail",
      description: "The URL of the item's image.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "item_name",
      description: "The name of the item you are adding.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  /**
   * @param {CommandInteraction} interaction
   */
  run: async (client, interaction, args) => {
    if (
      interaction.user.id !== "823933160785838091" &&
      interaction.user.id !== "883931596758081556"
    ) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription("You do not have permissions to use this command.")
            .setColor("303136"),
        ],
        ephemeral: true,
      });
    }
    const data = {
      id: interaction.options.getString("item_id"),
      value: interaction.options.getInteger("item_value"),
      thumbnail: interaction.options.getString("thumbnail"),
      item_name: interaction.options.getString("item_name"),
      category: interaction.options.getString("item_type"),
      item_emoji: interaction.options.getString("item_emoji"),
    };

    const item = await db.findOne({
      item_id: data.id,
    });

    if (item) {
      return await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `An item exists with the same ID:
**Name:** ${item.display.name}
**Value:** ${item.value.toLocaleString()}`
            )
            .setThumbnail(item.display.thumbnail)
            .setFooter({
              text: "Use the /edititem command to edit this.",
            }),
        ],
        ephemeral: true,
      });
    }

    let newDB = new db({
      item_id: data.id,
      value: data.value,
      display: {
        name: data.item_name,
        thumbnail: data.thumbnail,
      },
      item_emoji: data.item_emoji,
      category: data.category.toLowerCase(),
      lastUpdated: new Date().getTime(),
    }).save();

    await console.log(newDB);

    interaction.reply({
      embeds: [
        {
          title: data.item_name,
          description: `
New item created:

**Value:** ${data.value.toLocaleString()}`,
          thumbnail: {
            url: data.thumbnail,
          },
          color: "303136",
        },
      ],
    });
  },
};
