const Forge = require('../');

class testPlugin extends Forge.Plugin {
  constructor() {
    super("testPlugin", "Test Plugin", "R3alCl0ud", "1.0.0", "Plugin for testing, and an example");
    this.registerCommand(new exampleCommand(this));
    this.registerCommand(new exampleDM(this));
  }
}

class exampleCommand extends Forge.Command {
  constructor(plugin) {
    super("example", null);
  }
  message(message, author, channel, guild, client) {
    channel.sendMessage("seems to work");
  }
}

class exampleDM extends Forge.Command {
  constructor(plugin) {
    super("dmTest", null, {dmOnly: true});
  }
  message(message, author, channel, client) {
    message.edit("This was a test");
  }
}

module.exports = testPlugin;
