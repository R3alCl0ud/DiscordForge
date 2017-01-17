const Command = require('./Command');
const Collection = require('discord.js').Collection;
const EventEmitter = require('events').EventEmitter;

/**
 * @typedef {Object} PluginDetails An Object containing required {@link Plugin} information
 * @property {string} id The ID of the Plugin
 * @property {string} name The name of the Plugin
 * @property {string} author The author of the plugin
 * @property {string} version The version of the plugin
 * @property {string} description The description of the plugin
 */

/**
 * The starting point for making a plugin
 * @extends {EventEmitter}
 * @param {PluginDetails} details An Object containing required Plugin information
 */
class Plugin extends EventEmitter {
  constructor(details = {}) {
    super();
    if (typeof details !== 'object') throw new TypeError(`PluginDetails`);
    if (!details.id) throw new Error('id is required');
    if (!details.name) throw new Error('name is required');
    if (!details.author) throw new Error('author is required');
    if (!details.version) throw new Error('version is required');
    if (!details.description) throw new Error('description is required');
    if (typeof details.id !== 'string') throw new TypeError('id must be a string');
    if (typeof details.name !== 'string') throw new TypeError('name must be a string');
    if (typeof details.author !== 'string') throw new TypeError('author must be a string');
    if (typeof details.version !== 'string') throw new TypeError('version must be a string');
    if (typeof details.description !== 'string') throw new TypeError('description must be a string');

    /**
     * The Plugin's id
     * @type {string}
     * @readonly
     */
    this.id = details.id;

    /**
     * The Plugin's name
     * @type {string}
     * @readonly
     */
    this.name = details.name;

    /**
     * The Plugin's author
     * @type {string}
     * @readonly
     */
    this.author = details.author;

    /**
     * The Plugin's version
     * @type {string}
     * @readonly
     */
    this.version = details.version;

    /**
     * The Plugin's description
     * @type {string}
     * @readonly
     */
    this.description = details.description;


    this._commands = new Collection();
    this.once('ready', () => { this.ready = true; });
  }

  loadCommands() {
    throw new Error('loadCommands must be overwritten');
  }

  loadClient(client) {
    this.client = client;
  }

  /**
   * Registers a command to the plugin
   * @param {Command} command The command to register
   */
  registerCommand(command) {
    if ((command instanceof Command) && !this._commands.has(command.id)) {
      this._commands.set(command.id, command);
      command.register(this.client);
    }
  }

  /**
   * Removes a command from the guild
   * @param {Command} command The command to remove
   */
  removeCommand(command) {
    if ((command instanceof Command) && this._commands.has(command.id)) {
      this._commands.delete(command.id);
    }
  }

  get commands() {
    return this._commands;
  }
}


module.exports = Plugin;
