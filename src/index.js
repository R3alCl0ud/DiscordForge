const DiscordJS = require('discord.js');
const Guild = require('./structures/Guild');

module.exports = {

  DiscordJS: DiscordJS,

  // Regular Expressions
  YTRegex: /(?:https?:\/\/)?(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w-]+)(&(amp;)?[\w?=]*)?/,
  SCRegex: /(?:https?:\/\/)?(?:www\.)?(?:soundcloud\.com|snd\.sc)\/(.*)/,
  YTPlaylistRegex: /(?:https?:\/\/)?(?:www\.)?youtube\.com\/playlist\?list=([A-Za-z0-9_-]+)/,
  SCPlaylistRegex: /(?:https?:\/\/)?(?:www\.)?soundcloud\.com\/([a-zA-Z0-9]+)\/sets\/(.*)/,

  openJSON: require('./util').openJSON,
  writeJSON: require('./util').writeJSON,
  openJSONSync: require('./util').openJSONSync,
  writeJSONSync: require('./util').writeJSONSync,

  timeToMs: require('./util').timeToMs,
  hasRole: require('./util').hasRole,

  Client: require('./client/Client'),
  CommandHandler: require('./client/CommandHandler'),

  Plugin: require('./structures/Plugin'),
  Command: require('./structures/Command'),
  Guild: Guild,

  version: require('../package.json').version,

};
Guild.applyToClass(DiscordJS.Guild);

/**
 * Emmited when a non command message is received
 * @event Client#plainMessage
 * @param {Message} Message The message received
 */

/**
 * Emmited when a command has been ran
 * @event Client#command
 * @param {Command} Command The command that was ran
 */

/**
 * Emmited when a plugin has been loaded
 * @event Plugin#load
 * @param {Client} Client The client that registered the plugin
 */

/**
 * @external Message
 * @see {@link https://discord.js.org/#/docs/main/master/class/Message}
 */

/**
 * @external Client
 * @see {@link https://discord.js.org/#/docs/main/master/class/Client}
 */

/**
 * @external Guild
 * @see {@link https://discord.js.org/#/docs/main/master/class/Guild}
 */

 /**
  * @external GuildMember
  * @see {@link https://discord.js.org/#/docs/main/master/class/GuildMember}
  */

 /**
  * @external Role
  * @see {@link https://discord.js.org/#/docs/main/master/class/Role}
  */

/**
 * @external ClientOptions
 * @see {@link https://discord.js.org/#/docs/main/master/typedef/ClientOptions}
 */

/**
 * @external Collection
 * @see {@link https://discord.js.org/#/docs/main/master/class/Collection}
 */

/**
 * @external EvaluatedPermissions
 * @see {@link https://discord.js.org/#/docs/main/master/class/EvaluatedPermissions}
 */
