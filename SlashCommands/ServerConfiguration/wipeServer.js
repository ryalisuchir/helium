const overallSchema = require("../../Schemas/guildConfigurationSchema");
const donationSchema = require("../../Schemas/donationSchema");
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
const ms = require("ms");

module.exports = {
  name: "wipeserver",
  description: "Wipe a server.",
  type: ApplicationCommandType.ChatInput,
  category: "ServerConfiguration",

  /**
   * @param {CommandInteraction} interaction
   */
  run: async (client, interaction, args) => {

		let owner = await interaction.guild.fetchOwner()
		if (owner.id !== interaction.user.id) {
			return interaction.reply({
				embeds: [
					new EmbedBuilder()
					.setDescription(`Only the owner of the server can run this command.`)
					.setColor('303136')
				],
				ephemeral: true
			})
		} else {
			interaction.reply({
				embeds: [
					new EmbedBuilder()
					.setDescription(`
**Please read this information before selecting an option:**

By wiping this guild, you would like to remove all data collected on all users in this guild.
<:black_reply:982382122335625306> All manager roles and ping roles will be cleared.
<:black_reply:982382122335625306> All donations will be removed from all users for this specific guild.

> During this process, no logs will be deleted. Admins of <@958848741790609468> will still have access to view all commands ran.
`)
					.setFooter({ text: 'Please only proceed if you agree with the previous statements made. You, and admins of the bot will not have access to revert this decision.' })
					.setColor('303136')
				],
				components: [
					new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
						.setStyle(ButtonStyle.Secondary)
						.setCustomId('wipe')
						.setLabel('Wipe'),
						new ButtonBuilder()
						.setStyle(ButtonStyle.Secondary)
						.setCustomId('cancel')
						.setLabel('Cancel')
					)
				]
			})
		}

const filter = i => i.user.id === interaction.user.id;
const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });
collector.on('collect', async i => {

	if (i.customId === "wipe") {
		await overallSchema.findOneAndDelete({
			guildID: interaction.guild.id
		})
		await donationSchema.findOneAndDelete({
			guildID: interaction.guild.id
		})
		i.reply({
			content: 'This guild has been wiped.'
		})
	}
	if (i.customId === "cancel") {
		i.reply({
			content: 'This process has been cancelled.'
		})
	}

});

let disabledRow = new ActionRowBuilder()
		.addComponents(
						new ButtonBuilder()
						.setStyle(ButtonStyle.Secondary)
						.setCustomId('wipe')
						.setLabel('Wipe')
			.setDisabled(),
						new ButtonBuilder()
						.setStyle(ButtonStyle.Secondary)
						.setCustomId('cancel')
						.setLabel('Cancel')
			.setDisabled()
		)
		
collector.on('end', async collected => {
		interaction.editReply({
		components: [disabledRow],
		fetchReply: true
	})
});
		
	}
}