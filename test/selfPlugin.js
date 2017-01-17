const Forge = require('../');

class testPlugin extends Forge.Plugin {
  constructor() {
    super("testPlugin", "Test Plugin", "R3alCl0ud", "1.0.0", "Plugin for testing, and an example");
    this.registerCommand(new exampleCommand());
    this.registerCommand(new exampleDM());
  }
}

class exampleCommand extends Forge.Command {
  constructor(plugin) {
    super('example');
  }
  message(message, author, channel, guild, client) {
    channel.sendMessage("seems to work");
  }
}

class exampleDM extends Forge.Command {
  constructor() {
    super("dmTest", {dmOnly: true});
  }
  message(message, author, channel, client) {
    message.edit("This was a test");
  }
}

module.exports = testPlugin;
