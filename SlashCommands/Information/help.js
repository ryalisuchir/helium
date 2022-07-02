const {
  Message,
  Client,
  EmbedBuilder,
  ActionRowBuilder,
  SelectMenuBuilder,
  Interaction,
  ButtonBuilder,
} = require("discord.js");

module.exports = {
  name: "help",
  description: "A help menu.",
	type: 1,
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   * @param {String[]} args
   */
  run: async (client, interaction, args) => {
    const directories = [
      ...new Set(client.slashCommands.map((cmd) => cmd.directory)),
    ];
    const formatString = (str) =>
      `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;
    const categories = directories.map((dir) => {
      const getCommands = client.slashCommands
        .filter((cmd) => cmd.directory === dir)
        .map((cmd) => {
          return {
            name: cmd.name,
            description:
              cmd.description || "There is no description for this command.",
          };
        });
      return {
        directory: formatString(dir),
        commands: getCommands,
      };
    });
    const embed2 = new EmbedBuilder()
      .setTitle("𓂃 ៸៸ Help Menu:")
      .setDescription(
        `<:green:925389347631534090> Use the dropdown menu below to select a genre of commands.`
      )
      .setColor("303136");
    const components = (state) => [
      new ActionRowBuilder().addComponents(
        new SelectMenuBuilder()
          .setCustomId("help-menu")
          .setPlaceholder("Select a category...")
          .setDisabled(state)
          .addOptions(
            {
              label: "Information",
              value: "information",
            },
            {
              label: "Dank Memer",
              value: "mankdemer",
            },
            {
              label: "Requests",
              value: "requests",
            },
            {
              label: "ServerConfiguration",
              value: "serverconfiguration",
            },
            {
              label: "Statistics",
              value: "statistics",
            },
            {
              label: "User Specific",
              value: "user_specific",
            }
          )
      )
    ];

    const initialMessage = await interaction.reply({
      embeds: [embed2],
      components: components(false),
    });
    const filter = (interaction) => interaction.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      componentType: "SELECT_MENU",
      time: 18000,
    });
    collector.on("collect", (interaction) => {
      const [directory] = interaction.values;
      const category = categories.find(
        (x) => x.directory.toLowerCase() === directory
      );

      const categoryEmbed = new EmbedBuilder()
        .addFields(
          category.commands.map((cmd) => {
            return {
              name: `**${cmd.name}**`,
              value: `<:green:925389347631534090> ${cmd.description}`,
              inline: false,
            };
          })
        )
        .setColor("303136");

      interaction.update({
        embeds: [categoryEmbed],
      });
    });
    collector.on("end", () => {
      initialMessage.edit({
        components: components(true),
      });
    });
  },
};
