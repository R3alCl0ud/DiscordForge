const Guild = require('../structures/Guild');
class ForgeManager {
  constructor(client) {
    this.client = client;
    this.client.dataManager.newGuild = this.newGuild.bind(this);
    this.client.resolver.resolveGuild = this.resolveGuild.bind(this);
  }
  get pastReady() {
    return this.client.ws.status === 0;
  }


  newGuild(data) {
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
  }

  /**
   * Resolves a GuildResolvable to a Guild object
   * @param {GuildResolvable} guild The GuildResolvable to identify
   * @returns {?Guild}
   */
  resolveGuild(guild) {
    if (guild instanceof Guild) return guild;
    if (typeof guild === 'string') return this.client.guilds.get(guild) || null;
    return null;
  }
}

module.exports = ForgeManager;
