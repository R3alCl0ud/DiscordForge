const Guild = require('../structures/Guild');
const Plugin = require('../structures/Plugin');

class ForgeManager {
  constructor(client) {
    this.client = client;
    this.client.dataManager.newGuild = this.newGuild();
    this.client.resolver.resolveGuild = this.resolveGuild();
  }
  get pastReady() {
    return this.client.ws.status == 0;
  }

  
  newGuild() {
    return function(data) {
      const already = this.client.guilds.has(data.id);
      const guild = new Guild(this.client, data);
      this.client.guilds.set(guild.id, guild);
      if (this.pastReady && !already) {
        /**
         * Emitted whenever the client joins a Guild.
         * @event Client#guildCreate
         * @param {Guild} guild The created guild
         */
        if (this.client.options.fetchAllMembers) {
          guild.fetchMembers().then(() => { this.client.emit('guildCreate', guild); });
        } else {
          this.client.emit('guildCreate', guild);
        }
      }
      return guild;
    }.bind(this);
  }

  /**
   * Resolves a GuildResolvable to a Guild object
   * @param {GuildResolvable} guild The GuildResolvable to identify
   * @returns {?Guild}
   */
  resolveGuild() {
    return function(guild) {
      if (guild instanceof Guild) return guild;
      if (typeof guild === 'string') return this.client.guilds.get(guild) || null;
      return null;
    }.bind(this);
  }
}

module.exports = ForgeManager;
