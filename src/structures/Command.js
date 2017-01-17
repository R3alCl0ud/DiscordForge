const DiscordJS = require('discord.js');

/**
 * Options to be passed to used in a command
 * @typedef {Object} CommandOptions
 * @property {string} id The command's id
 * @property {string} description The description of the command
 * @property {string} [usage=command ID] The usage for the command
 * @property {Array.<string>} permissions Array of required permissions
 * @property {string} role Required role name
 * @property {Array.<string>|Array.<RegExp>} comparator an array of strings and/or Regular Expressions
 * @property {boolean} [caseSensitive=true] Whether or not the command should be case sensitive
 * @property {boolean} [dmOnly=false] Whether or not the command can only be ran in direct messages only
 * @property {boolean} [guildOnly=false] Whether or not the command can only be ran in a guild text channel. Cannot be true if dmOnly is true
 */

/**
 * The Command Object
 */
class Command {
  /**
   * @param {CommandOptions} options Option to be passed to the command.
   * @param {?Command} parent Command will only have a parent if it is registered as a sub command
   */
  constructor(options = {}, parent) {
    if (typeof options !== 'object') throw new TypeError('options must be an object');

    if (options.id === undefined) throw new Error('id is required');
    if (options.description === undefined) throw new Error('decription is required');
    if (options.permissions === undefined) throw new Error('permissions is required');
    if (options.role === undefined) throw new Error('role is required');
    if (options.comparator === undefined) throw new Error('comparator is required');
    if (typeof options.id !== 'string') throw new TypeError('id must be a string');
    if (typeof options.description !== 'string') throw new TypeError('description must be a string');
    if (options.permissions instanceof Array === false) throw new TypeError('permissions must be an array');
    if (typeof options.role !== 'string') throw new TypeError('role must be a string');
    if (options.comparator instanceof Array === false) throw new TypeError('comparator must be an array');

    /**
     * The ID of the command
     * @type {string}
     * @readonly
     */
    this.id = options.id;

    /**
     * The parent command, If the command is a sub command
     * @type {?Command}
     * @private
     */
    this._parent = parent;

    /**
     * If the command is case sensitive
     * @type {boolean}
     * @readonly
     */
    this.caseSensitive = !!options.caseSensitive;
    /**
     * If the command can only be used in DM/GroupDM.
     * @type {boolean}
     * @readonly
     */
    this.dmOnly = options.dmOnly !== undefined ? !!options.dmOnly : false;

    /**
     * If the command can only be used in a guild channel. Cannot be true is dmOnly is true.
     * @type {boolean}
     * @readonly
     */
    this.guildOnly = this.dmOnly === true ? false : !!options.guildOnly;

    /**
     * The description of the command
     * @type {string}
     */
    this.description = options.description;

    /**
     * The usage of the command
     * @type {string}
     */
    this.usage = this.parent instanceof Command ? `${this.parent.id} ${this.id}` : `${this.id}`;

    /**
     * The aliases of the command
     * @type {Array<string>}
     */
    this.names = [];

    this.registered = false;

    this.permissions = options.permissions;

    this.role = options.role;

    /**
     * Commands comparative function
     * @type {Array.<string>|Array.<RegExp>}
     * @readonly
     */
    this._comparator = options.comparator;

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
  }
  /**
   * Registers a command
   * @param {Command} command The subCommand to register
   */
  registerSubCommand(command) {
    if (command instanceof Command === false) throw new TypeError('command must be an instanceof Command');
    this.subCommands.set(command.id, command);
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
    if (this._comparator instanceof Array !== true) this._comparator = [this._comparator];
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
      alias.forEach(name => this.names.indexOf(name) === -1 ? this._comparator.push(this.caseSensitive ? name : name.toLowerCase()) : null);
    } else if (typeof alias === 'string') {
      if (this.names.indexOf(alias) === -1) this._comparator.push(this.caseSensitive ? alias : alias.toLowerCase());
    }
    return new Error('Alias must be a string or an array of strings');
  }
  /**
   * Registers an alias for this command
   * @param {string|Array<string>} alias A string or array of strings to set as an alias for the command
   */
  setAlias(alias) {
    this._addAlias(alias);
  }

  /**
   * The function to be executed when the command is called
   * @param {external:Message} message The message that is running the command
   * @param {external:GuildChannel|external:DMChannel|external:GroupDMChannel} channel The channel the command was executed in
   * @param {Array.<string>} args command arguments
   */
  response() {
    throw new Error('response must be overwritten');
  }

  /**
   * Method to check if a user has the proper permissions to
   * @param {external:GuildMember} guildMember The GuildMember to check for authorization
   * @param {external:GuildChannel} guildChannel The GuildChannel the command was called in
   * @returns {boolean}
   */
  checkAuthorization(guildMember, guildChannel) {
    // || guildMember.id === guildMember.guild.ownerID
    return guildMember.permissionsIn(guildChannel).hasPermissions(this.permissions) || this.role === '@everyone' || guildMember.roles.exists('name', this.options.role);
  }

  register(client) {
    this.client = client;
    this.registered = true;
  }

  get aliases() {
    if (this.Parent instanceof Command) {
      return this.Parent.subCommandAliases.get(this._id);
    } else {
      return this.Parent.aliases.get(this._id);
    }
  }

  get comparator() {
    return this._comparator;
  }

  get responses() {
    return this._responses;
  }
  get parent() {
    return this._parent;
  }
}

module.exports = Command;
