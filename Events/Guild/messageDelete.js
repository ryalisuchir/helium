const Event = require("../../Structures/Classes/event");
const client = require("../../index");

module.exports = new Event("messageDelete", async (message) => {
  if (message.partial) return; // content is null or deleted embed

  client.snipes[message.channel.id] = {
    author: message.author.tag,
    content: message.content,
    embeds: message.embeds,
    attachments: [...message.attachments.values()].map((a) => a.proxyURL),
    createdAt: message.createdTimestamp,
  };
});
