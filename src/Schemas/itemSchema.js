const { Schema, model } = require("mongoose");

const itemSchema = new Schema({
  itemName: String,
  itemID: String,
  itemPrice: Number,
  purchaseable: Boolean,
  buyPrice: Number,
  itemLimit: Number,
  description: String,
  effect: String,
  icon: String,
  usable: Boolean,
  craftable: Boolean,
  attack: Number,
  wisdom: Number,
  dexterity: Number,
  type: String
});

module.exports = model('itemSchema', itemSchema);