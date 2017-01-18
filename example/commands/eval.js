const { Command } = require('../../');

class evalCommand extends Command {
  constructor() {
    super({ id: 'eval', description: 'eval command', permissions: ['SEND_MESSAGES'], role: ['@everyone'], comparator: ['eval'] });
  }
  response(message, channel, args) {
    try {
      const com = eval(message.content.split(' ').slice(1).join(' '));
      channel.sendMessage('```\n' + com + '```');
    } catch (e) {
      channel.sendMessage('```\n' + e + '```');
    }
  }
}

module.exports = evalCommand;
