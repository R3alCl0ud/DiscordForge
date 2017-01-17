const Forge = require('../');

class testPlugin extends Forge.Plugin {
  constructor() {
    super({id: "testPlugin", name:"Test Plugin", author: "R3alCl0ud", version:"1.0.0", description:"Plugin for testing, and an example"});

    this.emit('ready');
  }

  loadCommands() {
    this.registerCommand(new exampleCommand());
  }
}

class exampleCommand extends Forge.Command {
  constructor() {
    super({ id: 'example',
        description: 'example command',
        permissions: ['SEND_MESSAGES'],
        role: '@everyone',
        comparator: ['example', 'exCMD']
      });
  }
  response(message, channel, args) {
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
