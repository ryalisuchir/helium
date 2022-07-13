const {
  Message,
  Client,
  EmbedBuilder,
  ActionRowBuilder,
  SelectMenuBuilder,
  Interaction,
  ApplicationCommandType,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  name: "help",
  description: "A help menu, to check out all of the bot's commands.",
  type: ApplicationCommandType.ChatInput,
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, interaction, args) => {
    const directories = [
      ...new Set(client.commands.map((cmd) => cmd.directory)),
    ];
    const formatString = (str) =>
      `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;
    const categories = directories.map((dir) => {
      const getCommands = client.commands
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
        "All commands are slash commands. Use <:slash:980152110127669279> to begin."
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
              label: "Requests",
              value: "requests",
            },
            {
              label: "Dank Memer",
              value: "mankdemer",
            },
            {
              label: "Configuration",
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
      ),
      new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setStyle(ButtonStyle.Link)
          .setLabel("Invite")
          .setURL(
            "https://discord.com/api/oauth2/authorize?client_id=958848741790609468&permissions=8&scope=bot%20applications.commands"
          )
      ),
    ];

    const initialMessage = await interaction.reply({
      embeds: [embed2],
      components: components(false),
    });
    const filter = (i) => i.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      componentType: 3,
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
              value: `<:whiteDot:962849666674860142> ${cmd.description}`,
              inline: false,
            };
          })
        )
        .setColor("303136");

      interaction.update({
        embeds: [categoryEmbed],
        components: components(false),
      });
    });
    collector.on("end", () => {
      interaction.editReply({
        components: components(true),
      });
    });
  },
};
