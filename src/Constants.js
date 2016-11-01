exports.defaults = {
  ClientOptions: {
    prefix: '/',
    guildConfigs: false,
    selfBot: false,
    defaultHelp: true,
    enabledPlugins: [],
    getConfigOption: null,
    setConfigOption: null,
  },
};

function mergeDefaults(def, given) {
  if (!given) return def;
  for (const key in def) {
    if (!{}.hasOwnProperty.call(given, key)) {
      given[key] = def[key];
    } else if (given[key] === Object(given[key])) {
      given[key] = mergeDefaults(def[key], given[key]);
    }
  }

  return given;
}

exports.mergeDefaults = mergeDefaults;
