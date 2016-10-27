const DiscordJS = require('discord.js');
// const util = require('../util');
const ForgeRegistry = require('./ForgeRegistry');
const CommandHandler = require('./CommandHandler');
const ForgeManager = require('./ForgeManager');

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
    this.forgeManager = new ForgeManager(this);

    /**
     * Client plugin and command registry
     * @type {ForgeRegistry}
     */
    this.registry = new ForgeRegistry(this);


    this.commandHandler = new CommandHandler(this);
    // this.dataManager.newGuild = this.forgeManager.newGuild;
    // this.resolver.resolveGuild = this.forgeManager.resolveGuild;
    /**
     * Default Options to use
     * @type {ClientDefaults}
     */
    this.defaults = { prefix: '!', selfBot: false };
    this.selfBot = this.defaults.selfBot;
    if (options.prefix !== null) this.defaults.prefix = options.prefix;
    if (options.selfBot !== null) this.selfBot = options.selfBot;
  }

  loadPlugins() {
    this.registry.plugins.forEach(plugin => plugin.emit('load', this));
  }

  load() {
    this.loadPlugins();
    this.handleCommands();
  }

  handleCommands() {
    this.on('message', message => this.commandHandler.handleMessage(message, message.author, message.channel, message.guild));
  }
}

module.exports = ForgeClient;
