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
                guildID: button.guild.id,
                userID: button.user.id
            })
            if (!weeklySS) {
                weeklySS = new weeklySchema({
                    guildID: button.guild.id,
                userID: button.user.id
                })
            }
            if (weeklySS.grinderDonations.thisWeek < parseInt(gaw.requirement)) {
                return button.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setDescription(`
                        You do not meet the requirements for this grinder giveaway:
                        Your weekly donations: **⏣ ${weeklySS.grinderDonations.thisWeek}**
                        Requirement for this giveaway: **⏣ ${gaw.requirement.toLocaleString()}**
                        
                        You must donate **⏣ ${Math.round(parseInt(gaw.requirement) - parseInt(weeklySS.grinderDonations.thisWeek))}** more.`)
.setColor('303136')
                    ],
                    ephemeral: true
                })
            }
          
            button.reply({
                embeds: [
                    new EmbedBuilder()
                    .setDescription(`You have successfully joined the giveaway for: ${gaw.prize}.`)
                    .setColor('303136')
                ],
                ephemeral: true
            })

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
                    content: `Only the host of the giveaway can reroll giveaways.`,
                    ephemeral: true,
                })
            }

            const winner = `<@${
                gaww.entries[Math.floor(Math.random() * gaww.entries.length)]
            }>`
            button.deferUpdate()

            await button.channel.send({
                content: `${winner}\nYou have won the reroll for **${
                    gaww.prize
                }**.`,
                components: [
                    new ActionRowBuilder().addComponents([
                        new ButtonBuilder()
                            .setLabel('Jump')
                            .setStyle(ButtonStyle.Link)
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