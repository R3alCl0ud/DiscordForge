const Collection = require('discord.js').Collection;
const Command = require('./Command');

/** Custom guild class extention, addes the needed thingies
 * @interface
 */
class Guild {

  setup(data) {
    super.setup(data);

    this._commands = new Collection();
    if (this.client.options.guildConfigs === true) {
      this._prefix = this.client.getConfigOption(this, 'prefix') || this.client.options.prefix;
      this.client.getConfigOption(this, 'commands').forEach(command => {
        this.registerCommand(new GuildCommand(this.client, command.id, command.message, this));
      });
    } else {
      this._prefix = this.client.options.prefix;
    }
  }

  /**
   * Registers a command to the guild
   * @param {Command} command The command to register
   */
  registerCommand(command) {
    if (command instanceof Command && !this._commands.has(command.id)) {
      this._commands.set(command.id, command);
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

  /**
   * Enables a plugin
   * @param {string} plugin the id of the plugin to disable
   */
  enablePlugin(plugin) {
    if (plugin !== undefined && typeof plugin === 'string' && this._enabledPlugins.indexOf(plugin) === -1) {
      this.client.emit('enablePlugin', this, this.client.registry.plugins.get(plugin));
      this._enabledPlugins.push(plugin);
    }
  }

  /**
   * Disables a plugin
   * @param {string} plugin the id of the plugin to disable
   */
  disablePlugin(plugin) {
    if (plugin !== undefined && typeof plugin === 'string' && this._enabledPlugins.indexOf(plugin) !== -1) {
      this.client.emit('disablePlugin', this, this.client.registry.plugins.get(plugin));
      const pos = this._enabledPlugins.indexOf(plugin);
      this._enabledPlugins.splice(pos, 1);
    }
  }

  _setPrefix(Prefix) {
    this._prefix = Prefix;
    this.client.setConfigOption(this, 'prefix', Prefix);
  }

  changePrefix(Prefix) {
    if (Prefix !== null && typeof Prefix === 'string') {
      this._setPrefix(Prefix);
    }
  }

  get prefix() {
    return this._prefix ? this._prefix : this.client.options.guildConfigs ? this.client.getConfigOption(this, 'prefix') || this.client.options.prefix : this.client.options.prefix;
  }

  get commands() {
    this._commands = this._commands ? this._commands : new Collection();
    if (this.client.options.guildConfigs === true) {
      this.client.getConfigOption(this, 'commands').forEach(command => {
        this.registerCommand(new GuildCommand(this.client, command.id, command.message, this));
      });
    }
    return this._commands;
  }

  get enabledPlugins() {
    if (!this._enabledPlugins) {
      if (this.client.options.guildConfigs) {
        this.client.getConfigOption(this, 'enabledPlugins').then(plugins => {
          this._enabledPlugins = plugins;
        });
      } else {
        this._enabledPlugins = this.client.options.enabledPlugins;
      }
    }
    return this._enabledPlugins;
  }

  static applyToClass(target) {
    for (const prop of ['prefix', 'commands', '_setPrefix', 'changePrefix', 'enabledPlugins', 'disablePlugin', 'enablePlugin', 'registerCommand', 'removeCommand']) {
      Object.defineProperty(target.prototype, prop, Object.getOwnPropertyDescriptor(this.prototype, prop));
    }
  }
}

class GuildCommand extends Command {
  constructor(client, id, message, guild) {
    super(client, id, message, guild);
    this.description = message;
  }
}

module.exports = Guild;
