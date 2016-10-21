const DiscordJS = require('discord.js');

const fs = require('fs');

const util = require('../util');
const CommandRegistry = require('./CommandRegistry');
const CommandHandler = require('./CommandHandler');
const ForgeManager = require('./ForgeManager');

/**
 * Options to be passed to used in a command
 * @typedef {Object} ClientDefaults
 * @property {string} [prefix=!] The default prefix to use for a guild
 * @property {boolean} [selfBot=false] Whether or not the client is a selfbot.
 * @property {boolean} [perGuild=false] Whether or not the client should use per guild settings.
 * @property {function} [selfBot=false] Whether or not the client is a selfbot.
 */
class ForgeClient extends DiscordJS.Client {
  constructor(options = {}) {
    super(options);
    this.forgeManager = new ForgeManager(this);


    this.registry = new CommandRegistry();


    this.commandHandler = new CommandHandler(this);




    // this.dataManager.newGuild = this.forgeManager.newGuild;
    // this.resolver.resolveGuild = this.forgeManager.resolveGuild;
    /**
     * Default Options to use
     * @type {ClientDefaults}
     */
    this.defaults = {
      prefix: "!",
      selfBot: false
    };
    this.selfBot = this.defaults.selfBot;
    if (options.prefix !== null) this.defaults.prefix = options.prefix;
    if (options.selfBot !== null) this.selfBot = options.selfBot;

  }

  load() {
      // this.startPlugins();
      this.listen();
  }
  /**
   * Depricated
   */
  startPlugins() {
    const pluginFolder = fs.readdirSync("./plugins");
    for (const plugin in pluginFolder) {
      if (fs.lstatSync('./plugins/' + pluginFolder[plugin]).isDirectory()) {
        const plFolder = fs.readdirSync('./plugins/' + pluginFolder[plugin]);
        for (const file in plFolder) {
          if (!fs.lstatSync('./plugins/' + pluginFolder[plugin] + '/' + plFolder[file]).isDirectory()) {
            var parts = plFolder[file].split(".");
            const file_no_ext = parts.splice(0, parts.length - 1).join(".");
            let potPlugin = require(`../../plugins/${pluginFolder[plugin]}/${file_no_ext}`);

            if (Object.getPrototypeOf(potPlugin) === Plugin) {
              const plug = new potPlugin(this.guilds, this.channels, this.users);
              this.registry.registerPlugin(plug);
              console.log("New Plugin Found! " + plug.name + " By: " + plug.author);
              plug.emit('load');
            } else {
              console.log("Non-plugin object found, ignoring");
              potPlugin = null;
            }
          }
        }
      }
    }
    this.emit('loaded');
  }

  handleCommands() {
    this.on('message', message => this.commandHandler.handleMessage(message, message.author, message.channel, message.guild));
  }

}



module.exports = ForgeClient;
