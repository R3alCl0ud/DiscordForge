const { Collection, Emoji, Role } = require('discord.js');
const Command = require('./Command');

/** Custom guild class extention, addes the needed thingies
 * @interface
 */
class GuildExtention {
  setup(data) {
    /**
     * The name of the guild
     * @type {string}
     */
    this.name = data.name;

    /**
     * The hash of the guild icon, or null if there is no icon.
     * @type {?string}
     */
    this.icon = data.icon;

    /**
     * The hash of the guild splash image, or null if no splash (VIP only)
     * @type {?string}
     */
    this.splash = data.splash;

    /**
     * The region the guild is located in
     * @type {string}
     */
    this.region = data.region;

    /**
     * The full amount of members in this Guild as of `READY`
     * @type {number}
     */
    this.memberCount = data.member_count || this.memberCount;

    /**
     * Whether the guild is "large" (has more than 250 members)
     * @type {boolean}
     */
    this.large = data.large || this.large;

    /**
     * A collection of presences in this Guild
     * @type {Collection<string, Presence>}
     */
    this.presences = new Collection();

    /**
     * An array of guild features.
     * @type {Object[]}
     */
    this.features = data.features;

    /**
     * A Collection of emojis that are in this Guild. The key is the emoji's ID, the value is the emoji.
     * @type {Collection<string, Emoji>}
     */
    this.emojis = new Collection();
    for (const emoji of data.emojis) this.emojis.set(emoji.id, new Emoji(this, emoji));

    /**
     * The time in seconds before a user is counted as "away from keyboard".
     * @type {?number}
     */
    this.afkTimeout = data.afk_timeout;

    /**
     * The ID of the voice channel where AFK members are moved.
     * @type {?string}
     */
    this.afkChannelID = data.afk_channel_id;

    /**
     * Whether embedded images are enabled on this guild.
     * @type {boolean}
     */
    this.embedEnabled = data.embed_enabled;

    /**
     * The verification level of the guild.
     * @type {number}
     */
    this.verificationLevel = data.verification_level;

    /**
     * The timestamp the client user joined the guild at
     * @type {number}
     */
    this.joinedTimestamp = data.joined_at ? new Date(data.joined_at).getTime() : this.joinedTimestamp;

    this.id = data.id;
    this.available = !data.unavailable;
    this.features = data.features || this.features || [];

    if (data.members) {
      this.members.clear();
      for (const guildUser of data.members) this._addMember(guildUser, false);
    }

    if (data.owner_id) {
      /**
       * The user ID of this guild's owner.
       * @type {string}
       */
      this.ownerID = data.owner_id;
    }

    if (data.channels) {
      this.channels.clear();
      for (const channel of data.channels) this.client.dataManager.newChannel(channel, this);
    }

    if (data.roles) {
      this.roles.clear();
      for (const role of data.roles) {
        const newRole = new Role(this, role);
        this.roles.set(newRole.id, newRole);
      }
    }

    if (data.presences) {
      for (const presence of data.presences) {
        this._setPresence(presence.user.id, presence);
      }
    }

    this._rawVoiceStates = new Collection();
    if (data.voice_states) {
      for (const voiceState of data.voice_states) {
        this._rawVoiceStates.set(voiceState.user_id, voiceState);
        const member = this.members.get(voiceState.user_id);
        if (member) {
          member.serverMute = voiceState.mute;
          member.serverDeaf = voiceState.deaf;
          member.selfMute = voiceState.self_mute;
          member.selfDeaf = voiceState.self_deaf;
          member.voiceSessionID = voiceState.session_id;
          member.voiceChannelID = voiceState.channel_id;
          this.channels.get(voiceState.channel_id).members.set(member.user.id, member);
        }
      }
    }

    this._commands = new Collection();
    this._enabledPlugins = [];
    if (this.client.options.guildConfigs === true) {
      this.client.getConfigOption(this, 'prefix').then(prefix => {
        this._prefix = prefix || this.client.options.prefix;
      }).catch(e => this.client.emit('warn', e));
      this.client.getConfigOption(this, 'commands').then(commands => {
        commands.forEach(command => {
          this.registerCommand(new GuildCommand(this.client, command.id, command.message, this));
        });
      }).catch(e => this.client.emit('warn', e));
      this.client.getConfigOption(this, 'enabledPlugins').then(plugins => {
        this._enabledPlugins = plugins;
      }).catch(e => this.client.emit('warn', e));
    } else {
      this._prefix = this.client.options.prefix;
    }
  }

  /**
   * Registers a command to the guild
   * @param {Command} command The command to register
   */
  registerCommand(command) {
    if (command instanceof Command && !this._commands.has(command.id)) {
      this._commands.set(command.id, command);
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

  /**
   * Enables a plugin
   * @param {string} plugin the id of the plugin to disable
   */
  enablePlugin(plugin) {
    if (plugin !== undefined && typeof plugin === 'string' && this._enabledPlugins.indexOf(plugin) === -1) {
      this.client.emit('enablePlugin', this, this.client.registry.plugins.get(plugin));
      this._enabledPlugins.push(plugin);
    }
  }

  /**
   * Disables a plugin
   * @param {string} plugin the id of the plugin to disable
   */
  disablePlugin(plugin) {
    if (plugin !== undefined && typeof plugin === 'string' && this._enabledPlugins.indexOf(plugin) !== -1) {
      this.client.emit('disablePlugin', this, this.client.registry.plugins.get(plugin));
      const pos = this._enabledPlugins.indexOf(plugin);
      this._enabledPlugins.splice(pos, 1);
    }
  }

  _setPrefix(Prefix) {
    this._prefix = Prefix;
    this.client.setConfigOption(this, 'prefix', Prefix);
  }

  /**
  * Changes the guild's prefix
  * @param {string} Prefix the new prefix for the guild
  */
  changePrefix(Prefix) {
    if (Prefix !== null && typeof Prefix === 'string') {
      this._setPrefix(Prefix);
    }
  }

  get prefix() {
    return this._prefix || this.client.options.prefix;
  }

  get commands() {
    return this._commands;
  }

  get enabledPlugins() {
    return this._enabledPlugins || this.client.options.enabledPlugins;
  }

  static applyToClass(target) {
    for (const prop of ['prefix', 'commands', '_setPrefix', 'changePrefix', 'enabledPlugins', 'disablePlugin', 'enablePlugin', 'registerCommand', 'removeCommand', 'setup']) {
      Object.defineProperty(target.prototype, prop, Object.getOwnPropertyDescriptor(this.prototype, prop));
    }
  }
}

class GuildCommand extends Command {
  constructor(id, message, guild) {
    super(id, message, guild);
    this.description = message;
  }
}

module.exports = GuildExtention;
