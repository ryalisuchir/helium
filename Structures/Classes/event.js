const ExtendedClient = require("../client");

/**
 * @template {keyof import("discord.js").ClientEvents} Key
 */
module.exports = class Event {
  /**
   * @param {Key} event
   * @param {(client: ExtendedClient, ...args: import("discord.js").ClientEvents[Key])} run
   */
  constructor(event, run) {
    this.event = event;
    this.run = run;
  }
};
