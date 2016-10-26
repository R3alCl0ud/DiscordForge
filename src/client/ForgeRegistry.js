const Plugin = require('../structures/Plugin');
const Command = require('../structures/Command');
const Collection = require('discord.js').Collection;
/**
 * This is the ForgeRegistry Register all the stuff to it
 *
 */
class ForgeRegistry {

  constructor(client) {
    this.client = client;
    this.plugins = new Collection();
    this.commands = new Collection();
    this.aliases = new Collection();
  }

  reloadPlugin(plugin) {
    if (plugin instanceof Plugin && this.plugins.has(plugin.id)) this.plugins.delete(plugin.id);
  }

  registerPlugin(plugin) {
    if (plugin instanceof Plugin) {
      this.plugins.set(plugin.id, plugin);
    }
  }

  registerAlias(command, alias) {
    this.aliases.set(alias, command);
  }

  registerCommand(command) {
    if (command instanceof Command) {
      this.commands.set(command.id, command);
    }
  }
}

module.exports = ForgeRegistry;
