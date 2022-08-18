const Event = require("../../Structures/Classes/event");
const client = require("../../index");
const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');
const giveawayModel = require('../../Schemas/giveawaySchema');
const weeklySchema = require('../../Schemas/weeklyDonationSchema');

module.exports = new Event("interactionCreate", async (button) => {

        if (!button.isButton()) return
        if (
            button.customId !== 'giveaway-join' &&
            button.customId !== 'giveaway-reroll'
        ) return;

        const gaw = await giveawayModel.findOne({
            messageId: button.message.id,
        })

        if (button.customId === 'giveaway-join') {
            if (gaw.hasEnded) {
                button.message.edit({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`Grinder Giveaway : ${gaw.prize} - Ended`)
                            .setFooter({
                                text: `Winners: ${gaw.winners} | Ended at`,
                            })
                            .setTimestamp()
                            .setColor('303136')
                            .setDescription(
                                `Winner(s): ${
                                    gaw.WWinners.map((w) => `<@${w}>`).join(
                                        ' '
                                    ) || "Couldn't fetch!"
                                }\nHost: <@${gaw.hosterId}>`
                            )
                    ],
                    components: [
                        new ActionRowBuilder().addComponents([
                            new ButtonBuilder()
                            .setEmoji({
                                name: 'CZ_giveaway',
                                id: '905181806922461214'
                            })
                                .setCustomId('giveaway-join')
                                .setStyle(ButtonStyle.Secondary)
                                .setDisabled(true),
                        ]),
                    ],
                })

                return button.reply({
                    content: 'This giveaway has already ended.',
                    ephemeral: true,
                })
            }
            if (gaw.entries.includes(button.user.id)) {
                button.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(
                                'You have already joined this giveaway.'
                            )
                            .setColor('303136'),
                    ],
                    ephemeral: true,
                })
                return
            }

            let weeklySS = await weeklySchema.findOne({
                guildID: interaction.guild.id,
                userID: interaction.user.id
            })
            if (!weeklySS) {
                weeklySS = new weeklySchema({
                    guildID: interaction.guild.id,
                userID: interaction.user.id
                })
            }
            if (weeklySS.grinderDonations.thisWeek < parseInt(gaw.requirement)) {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setDescription(`
                        You do not meet the requirements for this grinder giveaway:
                        Your weekly donations: **⏣ ${weeklySS.grinderDonations.thisWeek}**
                        Requirement for this giveaway: **⏣ ${gaw.requirement.toLocaleString()}**
                        
                        You must donate **⏣ ${Math.round(gaw.requirement.toLocaleString() - weeklySS.grinderDonations.thisWeek)}** more.`)
.setColor('303136')
                    ],
                    ephemeral: true
                })
            }
          

            await giveawayModel.findOneAndUpdate(
                {
                    messageId: gaw.messageId,
                },
                {
                    $push: {
                        entries: `${button.user.id}`,
                    },
                }
            )



        } else if (button.customId === 'giveaway-reroll') {
            const giveawayMessageId =
                button.message.components[0].components[0].url
                    .split('/')
                    .slice(-1)[0]
            const gaww = await giveawayModel.findOne({
                messageId: giveawayMessageId,
            })
            if (button.user.id !== gaww.hosterId) {
                return button.reply({
                    content: `Only the host of the giveaway can reroll winners...`,
                    ephemeral: true,
                })
            }

            const winner = `<@${
                gaww.entries[Math.floor(Math.random() * gaww.entries.length)]
            }>`
            button.deferUpdate()

            const embed = new EmbedBuilder()
                .setTitle('🎊 You have won a giveaway! 🎊')
                .setDescription(
                    `You have won the *reroll* for the giveaway **\`${gaww.prize}\`**!`
                )
                .addField('Host', `<@${gaww.hosterId}>`, true)
                .addField(
                    'Giveaway Link',
                    `[Jump](https://discord.com/channels/${gaww.guildId}/${gaww.channelId}/${gaww.messageId})`,
                    true
                )
                .setColor('GREEN')
                .setTimestamp()
            const id = winner.replace('<@', '').replace('>', '')
            client.functions.dmUser(client, id, {
                content: `<@${id}>`,
                embeds: embed,
            })
            await button.channel.send({
                content: `${winner}\nYou have won the reroll for **${
                    gaww.prize
                }**! Your chances of winning the giveaway were **${(
                    (1 / gaww.entries.length) *
                    100
                ).toFixed(3)}%**`,
                components: [
                    new ActionRowBuilder().addComponents([
                        new MessageButton()
                            .setLabel('Jump')
                            .setStyle('LINK')
                            .setURL(
                                `https://discord.com/channels/${gaww.guildId}/${gaww.channelId}/${gaww.messageId}`
                            ),
                        new ButtonBuilder()
                            .setLabel('Reroll')
                            .setCustomId('giveaway-reroll')
                            .setStyle(ButtonStyle.Secondary),
                    ]),
                ],
            })
        }
    });