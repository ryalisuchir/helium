const Event = require("../../Structures/Classes/event");
const client = require("../../index");
module.exports = new Event("interactionCreate", async (interaction) => {
  if (interaction.isChatInputCommand()) {
    const command = client.slashCommands.get(interaction.commandName);
    const args = [];

    if (!command)
      return interaction.followUp({
        content: "An error occured... Please try later.",
      });

    for (let option of interaction.options.data) {
      if (option.type === "SUB_COMMAND") {
        if (option.name) args.push(option.name);
        option.options?.forEach((x) => {
          if (x.value) args.push(x.value);
        });
      } else if (option.value) args.push(option.value);
    }

    await command.run(client, interaction, args).catch(console.error);
  }
});
