class ContextCommand {
  /**
   * @param {import("../Typescript-Structures/ContextCommand").CommandOptions} options
   */
  constructor(options) {
    this.name = options.name;
    this.type = options.type;
    this.run = options.run;
  }
}

module.exports = ContextCommand;
