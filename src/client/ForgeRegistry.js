const Plugin = require('../structures/Plugin');
const Command = require('../structures/Command');
const Collection = require('discord.js').Collection;
/**
 * This is the ForgeRegistry Register all the stuff to it
 *
 */
class ForgeRegistry {
  /**
   *
   * @param {Client} client The client that instantiated the registry
   */
  constructor(client) {
    this.client = client;
    this.plugins = new Collection();
    this.commands = new Collection();
    this.aliases = new Collection();
  }
  
  /**
   * Removes a plugin from the registry
   * @param {Plugin} plugin The plugin to register
   */
  removePlugin(plugin) {
    if (plugin instanceof Plugin && this.plugins.has(plugin.id)) this.plugins.delete(plugin.id);
  }

  /**
   * Registers a plugin to the registry
   * @param {Plugin} plugin The plugin to register
   */
  registerPlugin(plugin) {
    if (plugin instanceof Plugin) {
      this.plugins.set(plugin.id, plugin);
    }
  }

  /**
   * Registers an alias for a command
   * @param {Command} command The command to set an alias for
   * @param {string|Array<string>} alias the alias to set
   */
  registerAlias(command, alias) {
    this.aliases.set(alias, command.id);
  }

  /**
   * Registers a command
   * @param {Command} command The command to register
   */
  registerCommand(command) {
    if (command instanceof Command) {
      this.commands.set(command.id, command);
    }
  }

  /**
   * Removes a command from the command registry
   * @param {Command} command The command to remove
   */
  removeCommand(command) {
    if ((command instanceof Command) && this.commands.has(command.id)) {
      this._commands.delete(command.id);
    }
  }
}

module.exports = ForgeRegistry;
