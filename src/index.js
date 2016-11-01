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

  hmsToms: require('./util').timeToMs,

  timeToMs: require('./util').timeToMs,
  hasRole: require('./util').hasRole,
  hasPerms: require('./util').hasPerms,

  Client: require('./client/Client'),
  CommandHandler: require('./client/CommandHandler'),

  Plugin: require('./structures/Plugin'),
  Command: require('./structures/Command'),
  Guild: Guild,

};
Guild.applyToClass(DiscordJS.Guild);

/**
 * Emmited when a non command message is received
 * @event ForgeClient#plainMessage
 * @param {Message} Message The message received
 */

/**
 * Emmited when a command has been ran
 * @event ForgeClient#command
 * @param {Command} Command The command that was ran
 */

/**
 * Emmited when a plugin has been loaded
 * @event Plugin#load
 * @param {Client} Client The client that registered the plugin
 */

/**
 * @external Message
 * @see {@link http://hydrabolt.github.io/discord.js/#!/docs/tag/indev/class/Message}
 */

/**
 * @external Client
 * @see {@link http://hydrabolt.github.io/discord.js/#!/docs/tag/indev/class/Client}
 */

/**
 * @external Guild
 * @see {@link http://hydrabolt.github.io/discord.js/#!/docs/tag/indev/class/Guild}
 */

/**
 * @external ClientOptions
 * @see {@link http://hydrabolt.github.io/discord.js/#!/docs/tag/indev/typedef/ClientOptions}
 */

/**
 * @external Collection
 * @see {@link http://hydrabolt.github.io/discord.js/#!/docs/tag/indev/class/Collection}
 */
