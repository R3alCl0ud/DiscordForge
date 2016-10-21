const Guild = require('../structures/Guild');
const Plugin = require('../structures/Plugin');
const Command = require('../structures/Command');
/**
 * This is the CommandRegistry holds all of the commands in the world
 *
 */
class CommandRegistry {

  constructor(client) {
    this.client = client;
    this.plugins = new Map();
    this.commands = new Map();
    this.aliases = new Map();
  }

  reloadPlugin(plugin) {

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

module.exports = CommandRegistry;
