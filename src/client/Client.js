const DiscordJS = require('discord.js');
const util = require('../util');
const ForgeRegistry = require('./ForgeRegistry');
const CommandHandler = require('./CommandHandler');
const Constants = require('../Constants');
const DefaultHelp = require('../DefaultHelp').help;
const DefaultHelpSub = require('../DefaultHelp').helpSub;

/**
 * Options to be passed to used in a command
 * @typedef {Object} ForgeClientOptions
 * @property {string} [prefix='/'] The default prefix to use for a guild
 * @property {boolean} [selfBot=false] Whether or not the client is a selfbot.
 * @property {boolean} [guildConfigs=false] Whether or not the client should use per guild configs.
 * @property {Array<string>} [enabledPlugins=[]] Array of the IDs of plugins that should be enabled by default
 * @property {function} [getConfigOption=null] Optional custom function for retreiving guild config options
 * must except the same parameters as the default one, must return a Promise
 * @property {function} [setConfigOption=null] Optional custom function for setting guild config options
 * must except the same parameters as the default one, must return a Promise
 */


/**
 * The ForgeClient
 * @extends {Client}
 */
class Client extends DiscordJS.Client {

  /**
   * @param {ForgeClientOptions} options The options to pass to the client
   */
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

    /**
     * Default Options to use
     * @type {ForgeClientOptions}
     */
    this.options = Constants.mergeDefaults(Constants.defaults.ClientOptions, this.options);
    this.handleCommands();
    if (this.options.defaultHelp === true) {
      this.registry.registerCommand(new DefaultHelp(this.registry));
    }
    if (this.options.getConfigOption !== null && this.options.setConfigOption !== null) {
      this.getConfigOption = this.options.getConfigOption;
      this.setConfigOption = this.options.setConfigOption;
    }

    this.on('updateCommand', this.loadHelp.bind(this));
  }

  loadPlugins() {
    this.registry.plugins.forEach(plugin => plugin.emit('load', this));
  }

  /**
   * Loads the help command for a command
   * @param {Command} command The command to register help for
   */
  loadHelp(command) {
    const help = this.registry.commands.get('help') || new DefaultHelp(this, this.registry);
    if (this.options.defaultHelp === true) {
      if (!this.registry.commands.has('help')) {
        this.registry.registerCommand(help);
        command.subCommands.forEach(sub => {
          help.registerSubCommand(new DefaultHelpSub(sub, help));
        });
      }
    }
  }

  handleCommands() {
    this.on('message', message => this.commandHandler.handleMessage(message, message.member, message.channel, message.guild));
  }

  /**
   * Default function for getting per guild config options
   * @param {Guild} guild The guild to get the config option from
   * @param {string} prop The property to get from the guild's config file
   * @returns {Promise<string|number|Array|Object>}
   */
  getConfigOption(guild, prop) {
    const defaultConfig = {
      prefix: this.options.prefix,
      commands: [],
      enabledPlugins: [],
    };
    return new Promise((resolve, reject) => {
      util.openJSON(`./configs/${guild.id}.json`).then(config => {
        resolve(config[prop] || defaultConfig[prop]);
      }).catch(reject);
    });
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
        enabledPlugins: [],
      };
      defaultConfig[prop] = value;
      util.writeJSON(`./configs/${guild.id}.json`, defaultConfig);
    }
  }
}

module.exports = Client;
