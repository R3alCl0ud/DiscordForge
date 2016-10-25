const EventEmitter = require('events').EventEmitter;
const Command = require('./Command');
const Collection = require('discord.js').Collection;

class Plugin extends EventEmitter {

  /**
   * @param {string|object} [ID=noID] The ID of the Plugin
   * @param {string} [Name=No Name] The name of the Plugin
   * @param {string} [Author=Anon] The author of the plugin
   * @param {string} [Version=0.0.0] The version of the plugin
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
    this._commands = new Collection();
    this.aliases = new Collection();
  }

  registerAlias(command, alias) {
    this.aliases.set(alias, command);
  }

  registerCommand(potCommand) {
    // const isCommand = potCommand instanceof Command;
    // console.log(potCommand)
    if (!this._commands.has(potCommand.id)) this._commands.set(potCommand.id, potCommand);
    console.log(this.commands.get(potCommand.id).id);
  }
  get commands() {
    return this._commands;
  }
}


module.exports = Plugin;
