import {
  GuildMember,
  Message,
  PermissionResolvable,
  TextChannel,
} from "discord.js";
import ExtendedClient from "../Client";

interface ExtendedMessage extends Message {
  channel: TextChannel;
  member: GuildMember;
}

interface RunOptions {
  client: ExtendedClient;
  message: ExtendedMessage;
  args: Array<String>;
}

type RunFunction = (options: RunOptions) => any;

export type CommandType = {
  name: String;
  description: String;
  aliases?: Array<String>;
  category: String;
  usage?: String;
  userPermissions?: PermissionResolvable[];
  botPermissions?: PermissionResolvable[];
  nsfw?: Boolean;
  devOnly?: Boolean;
  run: RunFunction;
};
