const { Schema, model } = require("mongoose");

const itemsSchema = new Schema({
  item_id: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  item_emoji: { type: String, required: true },
  display: {
    name: { type: String, required: true },
    thumbnail: { type: String, required: true },
  },
  category: { type: String, required: true },
  lastUpdated: { type: Number, required: true },
});

module.exports = model("itemsSchema", itemsSchema);
