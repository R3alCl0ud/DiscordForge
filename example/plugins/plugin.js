const { Plugin } = require('../../');

class customPlugin extends Plugin {
  constructor() {
    super({
      id: 'customplugin',
      name: 'Custom Plugin',
      author: 'R3alCl0ud',
      version: '1.0.0',
      description: 'my very own custom plugin'
    });
  }

  loadCommands() {
    this.registerCommand(new customCommand())
  }
}

class customCommand extends Command {
  constructor() {
    super({ id:'customCommand', description: 'custom command', permissions: ['SEND_MESSAGES'], role: ['@everyone'], comparator: ['customCommand'] });
  }

  response(message, channel) {
    channel.sendMessage('this is a custom command');
  }
}

module.exports = customPlugin;
