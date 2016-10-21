const EventEmitter = require('events').EventEmitter;
const Command = require('./command');

class Plugin extends EventEmitter {

    /**
     * @param {string|object} ID The ID of the Plugin
     * @param {string} [Name] The name of the Plugin
     * @param {string} [Author] The author of the plugin
     * @param {string} [Version] The version of the plugin
     * @param {string} [Description] The description of the plugin
     */
    constructor(data = "noID", name = "no name", author = "Anon", version = "0.0.0", description = "No description") {
        super();
        if (typeof data === 'object') {
            this.id = data.id;
            this.name = data.name;
            this.author = data.author;
            this.version = data.version;
            this.description = data.description;
        } else if (typeof data === 'string') {
            this.id = data;
            this.name = name;
            this.author = author;
            this.version = version;
            this.description = description;
        }
        this.commands = new Map();
        this.aliases = new Map();
    }

    registerAlias(command, alias) {
        this.aliases.set(alias, command);
    }

    registerCommand(command) {
        if (command instanceof Command && !this._commands.has(command.id)) {
            this.commands.set(command.id, command);
        }
    }
}


module.exports = Plugin;
