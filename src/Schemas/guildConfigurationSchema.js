const { Schema, model } = require("mongoose");

const guildConfiguration = new Schema({
  guildID: { type: String, required: true },
  eventsManager: { type: String, required: false },
  giveawayManager: { type: String, required: false },
  partnershipManager: { type: String, required: false },
  heistManager: { type: String, required: false },
  middlemanManager: { type: String, required: false },
  eventsPing: { type: String, required: false },
  giveawayPing: { type: String, required: false },
  heistPing: { type: String, required: false },
  donationLogs: { type: String, required: false },
  giveawayCooldown: {
    type: String,
    default: 0,
  },
  eventCooldown: {
    type: String,
    default: 0,
  },
});
module.exports = model("guildConfiguration", guildConfiguration);
