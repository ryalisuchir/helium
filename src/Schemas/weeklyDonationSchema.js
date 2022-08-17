const { Schema, model } = require("mongoose");

const weeklyDonationsGrinder = new Schema({
  userID: { type: String, required: true },
  guildID: { type: String, required: true },
  grinderDonations: {
		thisWeek: { type: Number, required: false, default: 0 },
  },
});
module.exports = model("weeklyDonationsGrinder", weeklyDonationsGrinder);