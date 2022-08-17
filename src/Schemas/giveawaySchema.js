const { Schema, model } = require("mongoose");

const giveawaySchema = new Schema({
    guildId: { type: String, required: true },
    channelId: { type: String, required: true },
    messageId: { type: String, required: true },
    hosterId: { type: String, required: true },
    winners: { type: Number, required: true },
    prize: { type: String, required: true },
    endsAt: { type: Number, required: true },
    hasEnded: { type: Boolean, required: true },
    requirement: { type: Number, required: true },
    entries: [],
    WWinners: [],
    lastEntryCount: { type: Number, required: true },
})

module.exports = model('giveawaySchema', giveawaySchema)