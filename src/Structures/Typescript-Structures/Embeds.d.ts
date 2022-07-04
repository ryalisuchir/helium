import { EmbedFieldData, EmbedFooterData, ColorResolvable } from "discord.js";

export type EmbedOptions = {
  Title: string;
  Content: string;
  Color: ColorResolvable;
  Footer: EmbedFooterData;
  Fields: EmbedFieldData;
  Thumbnail: string;
};

export type InteractionEmbedOptions = {
  Title: string;
  Content: string;
  Color: ColorResolvable;
  Footer: EmbedFooterData;
  Fields: EmbedFieldData;
  Thumbnail: string;
  Ephemeral: boolean;
};
