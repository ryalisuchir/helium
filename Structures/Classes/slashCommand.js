class SlashCommand {
  /**
   * @param {import("../Typescript-Structures/SlashCommand").CommandType} option
   */
  constructor(option) {
    this.name = option.name;
    this.description = option.description;
    this.defaultPermission = option.defaultPermission;
    this.botPermissions = option.botPermissions;
    this.userPermissions = option.userPermissions;
    this.devOnly = option.devOnly;
    this.type = option.type;
    this.options = option.options;
    this.run = option.run;
  }
}

module.exports = SlashCommand;
