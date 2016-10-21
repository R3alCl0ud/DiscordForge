const Guild = require('../structures/Guild');
const Plugin = require('../structures/Plugin');

class ForgeManager {
  constructor(client) {
    this.client = client;
  }
  get pastReady() {
    return this.client.ws.status === 0;
  }

  newGuild(data) {
    const already = this.guilds.has(data.id);
    const guild = new Guild(this.client, data);
    this.client.guilds.set(guild.id, guild);
    if (this.pastReady && !already) {
      /**
       * Emitted whenever the client joins a Guild.
       * @event Client#guildCreate
       * @param {Guild} guild The created guild
       */
      if (this.client.options.fetchAllMembers) {
      } else {
      }
    }
    return guild;
  }

}

module.exports = ForgeManager;
