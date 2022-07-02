const Event = require("../../Structures/Classes/event");
const client = require("../../index");

module.exports = new Event("messageUpdate", async (oldMessage, newMessage) => {
  if (oldMessage.partial) return; // content is null

  client.editSnipes[oldMessage.channel.id] = {
    author: oldMessage.author.tag,
    content: oldMessage.content,
    createdAt: newMessage.editedTimestamp,
  };
});
