module.exports = {

  // Regular Expressions
  YTRegex: /(?:https?:\/\/)?(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-]+)(&(amp;)?[\w\?=]*)?/,
  SCRegex: /(?:https?:\/\/)?(?:www\.)?(?:soundcloud\.com|snd\.sc)\/(.*)/,
  YTPlaylistRegex: /(?:https?:\/\/)?(?:www\.)?youtube\.com\/playlist\?list=([A-Za-z0-9_-]+)/,
  SCPlaylistRegex: /(?:https?:\/\/)?(?:www\.)?soundcloud\.com\/([a-zA-Z0-9]+)\/sets\/(.*)/,

  openJSON: require('./src/util').openJSON,
  writeJSON: require('./src/util').writeJSON,

  hmsToms: require('./src/util').timeToMs,

  timeToMs: require('./src/util').timeToMs,
  hasRole: require('./src/util').hasRole,
  hasPerms: require('./src/util').hasPerms,

  ForgeClient: require('./src/client/ForgeClient'),
  CommandHandler: require('./src/client/CommandHandler'),

  Plugin: require('./src/structures/Plugin'),
  Command: require('./src/structures/Command'),
  Guild: require('./src/structures/Guild')

}
