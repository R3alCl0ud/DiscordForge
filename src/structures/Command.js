const DiscordJS = require('discord.js');

/**
 * Options to be passed to used in a command
 * @typedef {Object} CommandOptions
 * @property {boolean} [caseSensitive=true] Whether or not the command should be case sensitive
 * @property {boolean} [dmOnly=false] Whether or not the command can only be ran in direct messages only
 * @property {boolean} [guildOnly=false] Whether or not the command can only be ran in a guild text channel. Cannot be true if dmOnly is true
 * @property {string} [description=Default Description] The description of the command
 * @property {string} [usage=command ID] The usage for the command
 * @property {string|regex|function|Array<string>} [comparator=none] A string/regex to test the incoming message against, or function that returns a boolean, or and array of strings
 */

/**
 * The Command Object
 */
class Command {
  /**
   * @param {string} id The ID of the command.
   * @param {MessageGenerator|string|falsy} msgGenerator function.
   * @param {CommandOptions} options Option t be passed to the command.
   * @param {Command} parent Command will only have a parent if it is registered as a sub command
   */
  constructor(id, msgGenerator, options = {}, parent) {
    /**
     * The parent command, If the command is a sub command
     * @type {?Command}
     * @private
     */
    this.parent = parent;

    /**
     * The ID of the command
     * @type {string}
     * @readonly
     */
    this.id = id;

    /**
     * If the command is case sensitive
     * @type {boolean}
     * @readonly
     */
    this.caseSensitive = true;
    /**
     * If the command can only be used in DM/GroupDM.
     * @type {boolean}
     * @readonly
     */
    this.dmOnly = false;

    /**
     * If the command can only be used in a guild channel. Cannot be true is dmOnly is true.
     * @type {boolean}
     * @readonly
     */
    this.guildOnly = false;

    /**
     * The description of the command
     * @type {string}
     */
    this.description = 'Default Description';
    /**
     * The usage of the command
     * @type {string}
     */
    this.usage = `${this.id}`;
    /**
     * The aliases of the command
     * @type {Array<string>}
     */
    this.names = [];


    this._responses = [];

    if (msgGenerator instanceof Array) {
      msgGenerator.forEach(message => {
        this.responses.push(message);
      });
    } else if (typeof msgGenerator === 'string') {
      this.message = msgGenerator;
    }

    for (const option of Object.keys(options)) {
      if (option === 'guildOnly') {
        if (!this.dmOnly === true) this.guildOnly = false;
      } else {
        this[option] = options[option];
      }
    }

    /**
     * Collection of subCommands
     * @type {Collection<Command>}
     */
    this.subCommands = new DiscordJS.Collection();

    /**
     * Collection of subCommands aliases
     * @type {Collection<string>}
     */
    this.subCommandAliases = new DiscordJS.Collection();

    if (this.names && this.names instanceof Array) {
      this._addAlias(this.names);
    } else if (this.names && typeof this.names === 'string') {
      this._addAlias(this.names);
    }
  }
  /**
   * Registers a command
   * @param {Command|string} CommandOrId The subCommand to register or the id to use
   * @param {function|string|Array<string|function>|falsy} [msgGenerator] The how to respond to the message
   * @param {CommandOptions} [options] The options to pass to the subCommand
   */
  registerSubCommand(CommandOrId, msgGenerator, options) {
    if (CommandOrId instanceof Command) {
      this.subCommands.set(CommandOrId.id, CommandOrId);
    } else if (typeof CommandOrId === 'string') {
      this.subCommands.set(CommandOrId, new Command(CommandOrId, msgGenerator, this, options));
    }
  }

  /**
   * Registers an alias for a subCommand
   * @param {Command} subCommand The command to set an alias for
   * @param {string|Array<string>} alias t
   */
  setSubAlias(subCommand, alias) {
    this.subCommandAliases.set(alias, subCommand);
  }

  _addAlias(alias) {
    if (this.Parent instanceof Command) {
      if (alias instanceof Array) {
        return alias.forEach(name => {
          this.Parent.setSubAlias(this, this.caseSensitive ? name : name.toLowerCase());
          if (this.names.indexOf(name) === -1) this.names.push(this.caseSensitive ? name : name.toLowerCase());
        });
      } else if (typeof alias === 'string') {
        if (this.names.indexOf(alias) === -1) this.names.push(this.caseSensitive ? alias : alias.toLowerCase());
        return this.Parent.setSubAlias(this, this.caseSensitive ? alias : alias.toLowerCase());
      }
    }
    if (alias instanceof Array) {
      alias.forEach(name => this.names.indexOf(name) === -1 ? this.names.push(this.caseSensitive ? name : name.toLowerCase()) : null);
    } else if (typeof alias === 'string') {
      if (this.names.indexOf(alias) === -1) this.names.push(this.caseSensitive ? alias : alias.toLowerCase());
    }
    return new Error('Alias must be a string or an array of strings');
  }
  /**
   * Registers an alias for this command
   * @param {string|Array<string>} alias t
   */
  setAlias(alias) {
    this._addAlias(alias);
  }

  get aliases() {
    if (this.Parent instanceof Command) {
      return this.Parent.subCommandAliases.get(this._id);
    } else {
      return this.Parent.aliases.get(this._id);
    }
  }

  get responses() {
    return this._responses;
  }
}

module.exports = Command;
