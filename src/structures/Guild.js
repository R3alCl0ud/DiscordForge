const DiscordJS = require('discord.js');
const Command = require('./Command');


module.exports = class guild extends DiscordJS.Guild {
  constructor(client, data) {
    super(client, data);


    this._commands = new DiscordJS.Collection();

    if (!data) return;
    if (data.unavailable) {
      /**
       * Whether the Guild is available to access. If it is not available, it indicates a server outage.
       * @type {boolean}
       */
      this.available = false;

      /**
       * The Unique ID of the Guild, useful for comparisons.
       * @type {string}
       */
      this.id = data.id;
    } else {
      this.available = true;
      this.setup(data);
    }
  }

  setup(data) {
    super.setup(data);

    if (data.commands) {
      data.commands.forEach(command => {
        this.registerCommand(new Command(command.title, command.message, this));
      })
    }
    this._prefix = data.prefix || this.client.defaults.prefix;
    // this.enabledPlugins = data.enabledPlugins ? (data.enabledPlugins.length > 0 ? data.enabledPlugins : ["music", "currency", "help", "config", "custom"]) : ["music", "currency", "help", "config", "custom"];
  }

  registerCommand(command) {
    if (command instanceof Command && !this._commands.has(command.id)) {
      this._commands.set(command.id, command);
    }
  }

  removeCommand(command) {
    if (this._commands.has(command)) {
      this._commands.delete(command);
    }
  }

  enablePlugin(plugin) {
    if (plugin != null && typeof plugin == 'string' && this.enabledPlugins.indexOf(plugin) == -1) {
      console.log(`Enabling plugin: ${plugin}`)
      this.enabledPlugins.push(plugin);
    }
  }

  disablePlugin(plugin) {
    if (plugin != null && typeof plugin == 'string' && this.enabledPlugins.indexOf(plugin) != -1) {
      console.log(`Disabling plugin: ${plugin}`);
      const pos = this.enabledPlugins.indexOf(plugin);
      this.enabledPlugins.splice(pos, 1);
    }
  }

  _setPrefix(Prefix) {
    this._prefix = Prefix;
  }

  changePrefix(Prefix) {
    if (Prefix != null && typeof Prefix == 'string') {
      this._setPrefix(Prefix);
    }
  }

  get prefix() {
    return this._prefix;
  }

  get commands() {
    return this._commands;
  }
}
