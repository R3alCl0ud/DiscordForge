const DiscordJS = require('discord.js');

const fs = require('fs');
const EventEmitter = require('events');

const util = require('../util');
const CommandRegistry = require('./CommandRegistry');
const CommandHandler = require('./CommandHandler');
const ClientManager = require('./ClientManager');

class LoaderEmitter extends EventEmitter {}

const loaderEmitter = new LoaderEmitter();

loaderEmitter.on('pluginLoadEvent', () => {
  console.log("Plugin loaded.");

});

class CommandClient extends DiscordJS.Client {
  constructor(options) {
    super(options);
    this.ready = false;
    this.registry = new CommandRegistry();

    this.clientManager = new ClientManager(this);

  }

  load() {
    this.startPlugins();
    this.listen();
  }

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

  listen() {
    this.on('message', message => this.CommandHandler.handleMessage(message));
  }

  newGuild(data) {
    const already = this.guilds.has(data.id);
    const guild = new Guild(this.client, data);
    this.client.guilds.set(guild.id, guild);
    if (this.pastReady && !already) {
      /**
       * Emitted whenever the client joins a Guild.
       * @event Client#guildCreate
       * @param {Guild} guild The created guild
       */
      if (this.client.options.fetchAllMembers) {
        guild.fetchMembers().then(() => { this.client.emit(Constants.Events.GUILD_CREATE, guild); });
      } else {
        this.client.emit(Constants.Events.GUILD_CREATE, guild);
      }
    }

    return guild;
  }

}



module.exports = Bothandler;
