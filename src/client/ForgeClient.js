const DiscordJS = require('discord.js');

const fs = require('fs');

const util = require('../util');
const CommandRegistry = require('./CommandRegistry');
const CommandHandler = require('./CommandHandler');
const ForgeManager = require('./ForgeManager');

class ForgeClient extends DiscordJS.Client {

    constructor(options = {}) {
        super(options);
        this.registry = new CommandRegistry();
        this.commandHandler = new CommandHandler(this);
        this.forgeManager = new ForgeManager(this);
        this.dataManager.newGuild = this.forgeManager.newGuild;
        this.defaults = {
            prefix: "!"
        };
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

    listen() {
        this.on('message', message => this.commandHandler.handleMessage(message));
    }

}



module.exports = ForgeClient;
