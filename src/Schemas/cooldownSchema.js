const { Schema, model } = require("mongoose");

const cooldown = new Schema({
  userID: {
    type: String,
    required: true,
  },
  guildID: {
    type: String,
    required: true,
  },
  commandName: {
    type: String,
    required: true,
  },
  cooldown: {
    type: String,
    default: 0,
  },
});

module.exports = model("cooldownSchema", cooldown);

//Created by Shark#2538
