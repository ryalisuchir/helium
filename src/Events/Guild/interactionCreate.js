const Event = require("../../Structures/Classes/event");
const client = require("../../index");
const { InteractionType } = require("discord.js");
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

  if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
    if (interaction.commandName === "partnerping") {
      const focusedValue = interaction.options.getFocused();
      const choices = ["everyone", "here", "giveaways", "events", "heists"];
      const filtered = choices.filter((choice) =>
        choice.startsWith(focusedValue)
      );
      await interaction.respond(
        filtered.map((choice) => ({ name: choice, value: choice }))
      );
    }
    if (interaction.commandName === "additem") {
      const focusedValue = interaction.options.getFocused();
      const choices = [
        "collectable",
        "sellable",
        "tool",
        "power-up",
        "item pack",
        "drop item",
        "loot box",
        "tradeable",
      ];
      const filtered = choices.filter((choice) =>
        choice.startsWith(focusedValue)
      );
      await interaction.respond(
        filtered.map((choice) => ({ name: choice, value: choice }))
      );
    }

    if (interaction.commandName === "adddonations") {
      const focusedValue = interaction.options.getFocused();
      const choices = ["event", "giveaway", "heist"];
      const filtered = choices.filter((choice) =>
        choice.startsWith(focusedValue)
      );
      await interaction.respond(
        filtered.map((choice) => ({ name: choice, value: choice }))
      );
    }
  }
});
