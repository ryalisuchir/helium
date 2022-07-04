import {
  ApplicationCommandData,
  ContextMenuInteraction,
  GuildMember,
} from "discord.js";
import ExtendedClient from "../Client";

interface ExtendedContext extends ContextMenuInteraction {
  member: GuildMember;
}

interface RunOptions {
  client: ExtendedClient;
  interaction: ExtendedContext;
}

type RunFunction = (option: RunOptions) => any;

export type CommandOptions = {
  run: RunFunction;
} & ApplicationCommandData;
