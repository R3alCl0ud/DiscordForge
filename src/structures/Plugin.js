const Command = require('./Command');
const Collection = require('discord.js').Collection;

/**
 * @typedef {Object} PluginDetails An Object containing required {@link Plugin} information
 * @param {string} id The ID of the Plugin
 * @param {string} name The name of the Plugin
 * @param {string} author The author of the plugin
 * @param {string} version The version of the plugin
 * @param {string} description The description of the plugin
 */

/**
 * The starting point for making a plugin
 * @param {PluginDetails} details An Object containing required Plugin information
 */
class Plugin {

  constructor(details = {}) {
    if (typeof details !== 'object') throw new TypeError(`PluginDetails`);
    if (!details.id) throw new Error('Id is required');
    if (!details.id) throw new Error('name is required');
    if (!details.id) throw new Error('author is required');
    if (!details.id) throw new Error('version is required');
    if (!details.id) throw new Error('description is required');
    this._commands = new Collection();
  }

  loadCommands() {
    throw new Error('loadCommands must be overwritten');
  }

  /**
   * Registers a command to the plugin
   * @param {Command} command The command to register
   */
  registerCommand(command) {
    if ((command instanceof Command) && !this._commands.has(command.id)) {
      this._commands.set(command.id, command);
      command.register(this.client);
    }
  }

  /**
   * Removes a command from the guild
   * @param {Command} command The command to remove
   */
  removeCommand(command) {
    if ((command instanceof Command) && this._commands.has(command.id)) {
      this._commands.delete(command.id);
    }
  }

  get commands() {
    return this._commands;
  }
}


module.exports = Plugin;
