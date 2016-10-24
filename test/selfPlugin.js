const Forge = require('../');

class testPlugin extends Forge.Plugin {
  constructor(client) {
    super("testPlugin", "Test Plugin", "R3alCl0ud", "1.0.0", "Plugin for testing, and an example");
    this.client = client;

    this.registerCommand(new exampleCommand(this));
    this.registerCommand(new exampleDM(this));
  }
}

class exampleCommand extends Forge.Command {
  constructor(plugin) {
    super("example", null, plugin, {guildOnly: true});
  }
  Message(message, author, channel, guild, client) {
    message.edit("seems to work");
  }
}

class exampleDM extends Forge.Command {
  constructor(plugin) {
    super("dmTest", null, plugin, {dmOnly: true});
  }
  Message(message, author, channel, client) {
    message.edit("This was a test");
  }
}

module.exports = testPlugin;
