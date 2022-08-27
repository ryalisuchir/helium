const {
    EmbedBuilder,
    ApplicationCommandType,
    ApplicationCommandOptionType,
  } = require("discord.js");
  const db = require("../../Schemas/MankDemer/itemsSchema");
  
  module.exports = {
    name: "edititem",
    description: "Edit an item in the database.",
    type: ApplicationCommandType.ChatInput,
    category: "MankDemer",
    options: [
      {
        name: "item_id",
        description: "The ID of the item you are editing in the DB.",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: "item_value",
        description: "The donation value of the item you are editing in the DB.",
        type: ApplicationCommandOptionType.Integer,
        required: true,
      },
      {
        name: "item_type",
        description: "The type of the item you are editing in the DB.",
        type: ApplicationCommandOptionType.String,
        autocomplete: true,
        required: true,
      },
      {
        name: "item_emoji",
        description: "The emoji of the item you are editing in the DB.",
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
        description: "The name of the item you are editing.",
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

        if (!data.thumbnail && !data.value && !data.item_name) {
            return interaction.reply({
                content: `You literally didn't give me any options to edit this item...`,
                ephemeral: true
            })
        }

        const item = await db.findOne({
            item_id: data.itemId,
        })
        if (!item) return interaction.reply({
            content: 'No such item found.',
            ephemeral: true
        })

        if (data.url) {
            item.display.thumbnail = data.url
        }
        if (data.value) {
            item.value = data.value
        }
        if (data.itemId) {
            item.item_id = data.itemId
        }
        if (data.name) {
            item.display.name = data.name
        }

        item.save()
        interaction.reply({
            embeds: [
                {
                    title: item.display.name,
                    description: `**Value:** ${item.value.toLocaleString()}`,
                    color: '303136',
                    thumbnail: {
                        url: item.display.thumbnail,
                    },
                },
            ],
        })
    },
}