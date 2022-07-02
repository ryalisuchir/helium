class Command {
  /**
   * @param {import("../Typescript-Structures/Command").CommandType} option
   */
  constructor(option) {
    this.name = option.name;
    this.description = option.description;
    this.aliases = option.aliases;
    this.category = option.category;
    this.usage = option.usage;
    this.nsfw = option.nsfw;
    this.userPermissions = option.userPermissions;
    this.botPermissions = option.botPermissions;
    this.devOnly = option.devOnly;
    this.run = option.run;
  }
}

module.exports = Command;
