const overallSchema = require("../../Schemas/guildConfigurationSchema");
const donationSchema = require("../../Schemas/donationSchema");
const weeklySchema = require("../../Schemas/weeklyDonationSchema");
const giveawayDB = require("../../Schemas/giveawaySchema")
const ms = require('ms');
const wait = require("node:timers/promises").setTimeout;
const {
  EmbedBuilder,
  ApplicationCommandType,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  name: "grindergiveaway",
  description: "Create a giveaway for grinders depending on their weekly donation.",
  type: ApplicationCommandType.ChatInput,
  category: "Requests",
  options: [
    {
      name: "prize",
      description: "The prize for the giveaway.",
      type: ApplicationCommandOptionType.String,
      required: true
    },
    {
        name: "requirement",
        description: "The amount that should have been donated for the week.",
        type: ApplicationCommandOptionType.Integer,
        required: true
      },
      {
        name: "time",
        description: "The time for the giveaway.",
        type: ApplicationCommandOptionType.String,
        required: true
      },
      {
        name: "winners",
        description: "The number of winners in the giveaway.",
        type: ApplicationCommandOptionType.Integer,
        required: false
      },
  ],
  /**
   * @param {CommandInteraction} interaction
   */

  run: async (client, interaction, args) => {
console.log('hi')
    let grinderManagerSchema;
    grinderManagerSchema = await overallSchema.findOne({
        guildID: interaction.guild.id
    })
    console.log(grinderManagerSchema)
    if (!grinderManagerSchema || !grinderManagerSchema.grinderManager) {
        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setDescription('This guild has not set up grinding managers.')
                .setColor('303136')
            ],
            ephemeral: true
        })
    };

    let managerID = grinderManagerSchema.grinderManager.slice(3, -1);
    try {
      if (
        !interaction.member.roles.cache.has(managerID) &&
        !interaction.member.permissions.has([PermissionFlagsBits.Administrator])
      ) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                "You do not have the needed permissions to create grinder giveaways."
              )
              .setColor("303136"),
          ],
          ephemeral: true,
        });
      }
    } catch (err) {
        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setDescription('There is currently an invalid grinder role in the system. Please have an admin reset it.')
                .setColor('303136')
            ]
        })
    };

    const data = {
        prize: interaction.options.getString('prize'),
        winners: interaction.options.getInteger('winners') || 1,
        time: interaction.options.getString('time'),
        req: interaction.options.getInteger('requirement'),
    };

    let time = data.time
        if (isNaN(ms(time))) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setDescription('Please specify a valid time.')
                    .setColor('303136')
                ],
                ephemeral: true,
            })
        }
        time = ms(time)

        const winners = data.winners

        const giveawayEmbed = new EmbedBuilder()
        .setTitle('Grinder Giveaway : ' + data.prize)
        .setDescription(`Use the button below to enter the giveaway:
        **Time:** ${ms(time, { long: true })} (<t:${((new Date().getTime() + parseInt(time))/1000).toFixed(0)}:R>)
        **Requirement:** You must have donated **⏣ ${parseInt(data.req).toLocaleString()}** this week.`)
        .setFooter({
         text: `Winners: ${winners} | Ends at `
  })
  .setColor('303136')
  .setTimestamp(new Date().getTime() + time)

  const giveawayRow = new ActionRowBuilder()
  .addComponents(
    new ButtonBuilder()
    .setCustomId('giveaway-join')
    .setStyle(ButtonStyle.Secondary)
    .setEmoji({
        name: 'CZ_giveaway',
        id: '905181806922461214'
    })
  );
    interaction.reply({
        content: 'Your giveaway will start momentarily...',
        ephemeral: true
    })
  const sentMessage = await interaction.channel.send({
    embeds: [giveawayEmbed],
    components: [giveawayRow]
  })

  const giveawayDatabase = {
    guildId: interaction.guild.id,
    channelId: interaction.channel.id,
    messageId: sentMessage.id,
    hosterId: interaction.user.id,
    winners,
    prize: data.prize,
    endsAt: new Date().getTime() + time,
    hasEnded: false,
    requirement: parseInt(data.req),
    entries: [],
}

new giveawayDB(giveawayDatabase).save()

    }
};