import {
  ChatInputApplicationCommandData,
  CommandInteraction,
  GuildMember,
  PermissionResolvable,
} from "discord.js";
import ExtendedClient from "../Client";

export interface ExtendedInteraction extends CommandInteraction {
  member: GuildMember;
}

interface RunOptions {
  client: ExtendedClient;
  interaction: ExtendedInteraction;
  args: Array<String>;
}

type RunFunction = (options: RunOptions) => any;

export type CommandType = {
  userPermissions?: PermissionResolvable[];
  botPermissions?: PermissionResolvable[];
  devOnly?: Boolean;
  run: RunFunction;
} & ChatInputApplicationCommandData;
