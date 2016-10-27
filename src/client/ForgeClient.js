const DiscordJS = require('discord.js');
const util = require('../util');
const ForgeRegistry = require('./ForgeRegistry');
const CommandHandler = require('./CommandHandler');
const Constants = require('../Constants');
const DefaultHelp = require('../DefaultHelp');

/**
 * Options to be passed to used in a command
 * @typedef {Object} ClientDefaults
 * @property {string} [prefix=!] The default prefix to use for a guild
 * @property {boolean} [selfBot=false] Whether or not the client is a selfbot.
 * @property {boolean} [perGuild=false] Whether or not the client should use per guild settings.
 * @property {function} [selfBot=false] Whether or not the client is a selfbot.
 * @extends {DiscordJS.Client}
 */
class ForgeClient extends DiscordJS.Client {
  constructor(options = {}) {
    super(options);

    /**
     * Client plugin and command registry
     * @type {ForgeRegistry}
     */
    this.registry = new ForgeRegistry(this);

    /**
     * Client command handler
     * @type {CommandHandler}
     */
    this.commandHandler = new CommandHandler(this);
    // this.dataManager.newGuild = this.forgeManager.newGuild;
    // this.resolver.resolveGuild = this.forgeManager.resolveGuild;

    /**
     * Default Options to use
     * @type {ClientDefaults}
     */
    this.options = Constants.mergeDefaults(Constants.defaults.ClientOptions, this.options);
    this.handleCommands();

    this.on('updateCommand', this.loadHelp.bind(this));
  }

  loadPlugins() {
    this.registry.plugins.forEach(plugin => plugin.emit('load', this));
  }

  loadHelp() {
    if (this.options.defaultHelp === true) {
      this.registry.registerCommand(new DefaultHelp(this.registry));
    }
  }

  handleCommands() {
    this.on('message', message => this.commandHandler.handleMessage(message, message.author, message.channel, message.guild));
  }

  /**
   * Default function for getting per guild config options
   * @param {Guild} guild The guild to get the config option from
   * @param {string} prop The property to get from the guild's config file
   * @returns {string|number|Array|Object}
   */
  getConfigOption(guild, prop) {
    const defaultConfig = {
      prefix: this.options.prefix,
      commands: [],
      enabledPlugins: [] };
    const config = util.openJSON(`./configs/${guild.id}.json`);
    if (config) return config[prop];
    return defaultConfig[prop];
  }

  /**
   * Default function for changing per guilf config options
   * @param {Guild} guild The guild to set the config option for
   * @param {string} prop The property in the config to change
   * @param {string|number|Array|Object} value The value to set the config property to
   */
  setConfigOption(guild, prop, value) {
    const config = util.openJSON(`./configs/${guild.id}.json`);
    if (config) {
      config[prop] = value;
    } else {
      const defaultConfig = {
        prefix: this.options.prefix,
        commands: [],
        enabledPlugins: [] };
      defaultConfig[prop] = value;
      util.writeJSON(`./configs/${guild.id}.json`, defaultConfig);
    }
  }
}

module.exports = ForgeClient;
