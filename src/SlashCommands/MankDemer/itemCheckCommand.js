const {
  EmbedBuilder,
  ApplicationCommandType,
  ApplicationCommandOptionType,
} = require("discord.js");
const fetch = require("node-fetch");
const itemsSchema = require("../../Schemas/MankDemer/itemsSchema");
module.exports = {
  name: "value",
  description: "Check the value of a certain item.",
  type: ApplicationCommandType.ChatInput,
  category: "Economy",
  options: [
    {
      name: "query",
      description: "A specific item's value.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  /**
   * @param {CommandInteraction} interaction
   */
  run: async (client, interaction, args) => {
    const items = await fetch(
      "https:raw.githubusercontent.com/DankMemer/dankmemer.lol/rewrite/src/data/itemsData.json"
    ).then((r) => r.json());

    const queryy = interaction.options.getString("query");

    if (queryy.length < 3) {
      return interaction.reply({
        content: "Please specify an argument that is more than 3 characters.",
      });
    }

    function similarityBetween(s1, s2) {
      let longer = s1;
      let shorter = s2;
      if (s1.length < s2.length) {
        longer = s2;
        shorter = s1;
      }
      const longerLength = longer.length;
      if (longerLength === 0) {
        return 1.0;
      }
      return (
        (longerLength - editDistance(longer, shorter)) /
        parseFloat(longerLength)
      );
    }
    function editDistance(s1, s2) {
      s1 = s1.toLowerCase();
      s2 = s2.toLowerCase();

      const costs = [];
      for (let i = 0; i <= s1.length; i++) {
        let lastValue = i;
        for (let j = 0; j <= s2.length; j++) {
          if (i === 0) {
            costs[j] = j;
          } else {
            if (j > 0) {
              let newValue = costs[j - 1];
              if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
                newValue =
                  Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
              }
              costs[j - 1] = lastValue;
              lastValue = newValue;
            }
          }
        }
        if (i > 0) {
          costs[s2.length] = lastValue;
        }
      }
      return costs[s2.length];
    }

    function search(query) {
      query = query.toLowerCase();

      const target = items;
      const candidates = [];

      for (const item in target) {
        const candidate = {
          item: target[item],
          similarity: 0,
        };

        if (candidate.item.id.toLowerCase() === query) {
          candidate.similarity = 1;
        } else if (candidate.item.name.toLowerCase() === query) {
          candidate.similarity = 0.999;
        } else if (
          candidate.item.name.toLowerCase().includes(" " + query + " ") ||
          candidate.item.id.includes(" " + query + " ")
        ) {
          candidate.similarity = 0.998;
        } else if (
          candidate.item.name.toLowerCase().includes(query + " ") ||
          candidate.item.id.includes(query + " ")
        ) {
          candidate.similarity = 0.997;
        } else if (
          candidate.item.name.toLowerCase().includes(" " + query) ||
          candidate.item.id.includes(" " + query)
        ) {
          candidate.similarity = 0.997;
        } else if (
          candidate.item.name.toLowerCase().includes(query) ||
          candidate.item.id.includes(query)
        ) {
          candidate.similarity = 0.996;
        } else {
          const similarity = similarityBetween(query, candidate.item.name);
          candidate.similarity = similarity;
        }

        candidates.push(candidate);
      }
      return candidates.sort((a, b) => b.similarity - a.similarity);
    }

    let final = search(queryy).slice(0, 1);

    let schema;
    schema = await itemsSchema.findOne({
      item_id: `${final[0].item.id}`,
    });
    if (!schema) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `My database shows that such an item exists, but I am unable to find it.`
            )
            .setFooter({
              text: "Please DM Shark#2538 if this issue continues to persist after 24 hours from now.",
            })
            .setColor("303136"),
        ],
        ephemeral: true,
      });
    }

    let finalrarity;
    function determineRarity(rarity) {
      let rarityAmount = parseInt(rarity);
      if ((rarityAmount = 0)) finalrarity = "Common";
      if ((rarityAmount = 1)) finalrarity = "Uncommon";
      if ((rarityAmount = 2)) finalrarity = "Rare";
      if ((rarityAmount = 3)) finalrarity = "Epic";
      if ((rarityAmount = 4)) finalrarity = "Legendary";
      if ((rarityAmount = 4)) finalrarity = "Godly";
      if ((rarityAmount = 4)) finalrarity = "Godly";
      return finalrarity;
    }
    function CurrencyFormat(number) {
      const MONEY = ["", "k", "M", "G", "T", "P", "E"];
      const ranking = (Math.log10(number) / 3) | 0;
      if (!ranking) return number.toString();
      const last = MONEY[ranking];
      const scale = Math.pow(10, ranking * 3);
      const scaled = number / scale;

      return `${scaled.toFixed(2)}${last}`;
    }

    let finalEmbed = new EmbedBuilder()
      .setTitle(`${final[0].item.name}`)
      .setDescription(
        `\n> ${final[0].item.longdescription || final[0].item.description}
╭───╯
┃ <:whiteDot:962849666674860142> **Donation Value:** ⏣ ${schema.value.toLocaleString()} (${CurrencyFormat(
          schema.value
        )})
╰┈┈➤
\n
`
      )
      .addFields(
        {
          name: "Rarity:",
          value: `\`${determineRarity(final[0].item.rarity)}\``,
          inline: true,
        },
        { name: "Type:", value: `\`${final[0].item.type}\``, inline: true },
        { name: "ID:", value: `\`${final[0].item.id}\``, inline: true }
      )
      .setThumbnail(`${final[0].item.image}`)
      .setColor("#303136");
    interaction.reply({
      embeds: [finalEmbed],
    });
  },
};
