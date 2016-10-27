const Command = require('./structures/Command');

class help extends Command {
  constructor(registry) {
    super('help', null, registry);
  }
  message(message, author, channel, guild) {

  }
}

class helpSub extends Command {
  constructor(command, Help) {
    super(command.id, null, Help);
    this.command = command;
  }
  message(message, author, channel, guild) {

  }
}

exports.defaultHelp = help;
exports.defaultHelpSub = helpSub;
