const EventEmitter = require('events').EventEmitter;
// const Command = require('./Command');
const Collection = require('discord.js').Collection;

class Plugin extends EventEmitter {

  /**
   * @param {string|object} [id=noID] The ID of the Plugin
   * @param {string} [name=No Name] The name of the Plugin
   * @param {string} [author=Anon] The author of the plugin
   * @param {string} [version=0.0.0] The version of the plugin
   * @param {string} [description] The description of the plugin
   */
  constructor(id = 'noID', name = 'no name', author = 'Anon', version = '0.0.0', description = 'No description') {
    super();
    if (typeof id === 'object') {
      this.id = id.id;
      this.name = id.name;
      this.author = id.author;
      this.version = id.version;
      this.description = id.description;
    } else if (typeof id === 'string') {
      this.id = id;
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
    // console.log(this.commands.get(potCommand.id).id);
  }
  get commands() {
    return this._commands;
  }
}


module.exports = Plugin;
