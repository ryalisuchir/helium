const { Schema, model } = require("mongoose");

const donationSchema = new Schema({
  userID: { type: String, required: true },
  guildID: { type: String, required: true },
  pendingDonations: {
    event: { type: Boolean, required: false, default: false },
    giveaway: { type: Boolean, required: false, default: false },
    heist: { type: Boolean, required: false, default: false },
    middleman: { type: Boolean, required: false, default: 0 },
  },
  timesDonated: {
    event: { type: Number, required: false, default: 0 },
    giveaway: { type: Number, required: false, default: 0 },
    heist: { type: Number, required: false, default: 0 },
  },
  timesAccepted: {
    event: { type: Number, required: false, default: 0 },
    giveaway: { type: Number, required: false, default: 0 },
    heist: { type: Number, required: false, default: 0 },
    middleman: { type: Number, required: false, default: 0 },
  },
  donations: {
    event: { type: Number, required: false, default: 0 },
    giveaway: { type: Number, required: false, default: 0 },
    heist: { type: Number, required: false, default: 0 },
  },

  //
});
module.exports = model("donationSchema", donationSchema);
