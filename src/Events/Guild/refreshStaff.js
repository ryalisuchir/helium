const {
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");

const Event = require("../../Structures/Classes/event");
const donationSchema = require("../../Schemas/donationSchema");
const overallSchema = require("../../Schemas/guildConfigurationSchema");
const client = require("../../index");
const wait = require("node:timers/promises").setTimeout;

module.exports = new Event("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId === "refreshbutton") {
    if (interaction.user.id !== "823933160785838091") {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription("You cannot use this button.")
            .setColor("303136"),
        ],
        ephemeral: true,
      });
    }
    interaction.update({
      embeds: [
        new EmbedBuilder()
          .setColor("303136")
          .setTitle("**Events Staff:**")
          .setDescription(
            `
1. After you receive an event request, read it to ensure that the user's donations add up to one million or more.
2. If you don't recognize the event the user is donating for, ASK.
3. Accept the donation using the interaction on the embed.

**Once the user gives you the items/cash:**

1. Add the user's donations using a slash command,
> <a:sahadyellow:973374838519509083> \`/adddonations <event> <user> <amount>\`
> Please make sure you add their donations in the events category.
2. Use the following slash command in the donations channel,
> \`/donationhelp <event>\`
> <a:sahadblue:973370472924332082> Please keep conversations minimal in the donations channel.

**Hosting the event:**

1. In the events realm, use the following slash command to ping,
> <a:sahadyellow:973374838519509083> \`/ping <events> <event> <message> <donor> <prize>\`
> <a:sahadblue:973370472924332082> Pings may only be used every 5 minutes, even if the last held event was not conducted by yourself.
2. Host the event (you should have been trained on how to host one).
3. Do payouts.
4. Say something along the lines of,
> <a:sahadblue:973370472924332082> "Thanks for attending! Please donate in ... for more events."
`
          )
          .setFooter({
            text: "If you have not been trained, please contact a head events manager or an admin.",
          }),
        new EmbedBuilder()
          .setColor("303136")
          .setTitle("**Giveaways Staff:**")
          .setDescription(
            `
1. After you receive a giveaway request, ensure that the role ID is valid, and the prize exceeds one million in overall value.
2. Accept the giveaway, and patiently wait to receive the prize.
3. Add the donations using the slash command,
> <a:sahadyellow:973374838519509083> \`/adddonations <giveaway> <user> <amount>\`
> <a:sahadblue:973370472924332082> Ensure that you add the donations in the giveaway category.
4. Use the command in the donations help channel,
> \`/donationhelp <giveaway>\`
> <a:sahadblue:973370472924332082> Keep conversations minimal in the channel.

**Hosting the giveaway:**

1. To host a giveaway, follow the following structure,
> <a:sahadyellow:973374838519509083> \`+gstart <time> <winners> <requirement1;;requirement2;;requirement3> <prize>\`
> <a:sahadblue:973370472924332082> The requirements is only for specific roles in the server.
2. If needed, you may have to reroll the giveaway. You reroll the giveaway if the winner did not complete a set requirement by the donator, or in other special circumstances. Use the following structure,
> <a:sahadyellow:973374838519509083> \`+greroll <message_id>\`

The message ID is an 18-digit number for every message. You can find it by double clicking a message. If the option does not show up, active developer mode in your settings.

**Additional notes:**
<:black_reply:982382122335625306> Requirements not including roles such as "say thanks in general", must be said separately in the giveaways channel after the ping.
<:black_reply:982382122335625306> Giveaway managers will not accept nitro giveaways. Tell the donator to contact an admin.
`
          )
          .setFooter({
            text: "If any bots are offline, please keep a reminder to host the giveaway/add donations at a later time.",
          }),
        new EmbedBuilder()
          .setColor("303136")
          .setImage(
            "https://media.discordapp.net/attachments/988136232590647396/997548167103000757/Screen_Shot_2022-07-15_at_12.00.05_PM-removebg-preview.png"
          ),
        new EmbedBuilder().setColor("303136").setDescription(`
**Useful commands:**
Adding donations: \`/adddonations <event/giveaways> <message_id> <user>\`
Removing donations: \`/removedonations <event/giveaways> <user> <amount>\`
Pinging: \`/ping <events/giveaways>\`
Creating giveaways: \`+gstart <time> <winners> <requirements> <Prize/Event>\`
Reroll giveaways: \`+greroll <message_id>\`

Please fill in the needed information along with optional information when pinging.

**To add donations, please use the message ID of the successful trade embed from Dank Memer.**

- **Wait 15 minutes before pinging giveaways.**
- **Winners have 12 hours to claim their giveaway (exception: the user has the <@&986818089473683506> role - then they get 24 hours)
- Giveaway bots: <@808706062013825036> <@700743797977514004> <@807692666107985941> <@742231542209708103>

`),
      ],
    });
  }
});
