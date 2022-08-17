const client = require("../../index");
const Event = require("../../Structures/Classes/event");

module.exports = new Event("messageCreate", async (message) => {
  if (message.author.bot || !message.guild || message.webhookID) return;
  if (!message.content.toLowerCase().startsWith(client.prefix)) return;

  if (!message.member)
    message.member = await message.guild.fetchMember(message);
  const [cmd, ...args] = message.content
    .slice(client.prefix.length)
    .trim()
    .split(/ +/g);

  const command =
    client.commands.get(cmd.toLowerCase()) ||
    client.commands.get(client.aliases.get(cmd.toLowerCase()));

  if (!command) return;

  await command.run(client, message, args);
});
