const Command = require('./structures/Command');

const Tab = '    ';

class help extends Command {
  constructor(registry) {
    super('help', null, registry);
  }
  message(message, author, channel, guild, client) {
    const helpText = [`Showing command list for **${author.username}**`];
    if (client.options.guildConfigs === true) {
      client.registry.plugins.forEach(plugin => {
        if (guild.enabledPlugins.indexOf(plugin.id) === -1) return null;
        helpText.push(`**${plugin.name}**`);
        plugin.commands.forEach(command => {
          helpText.push(`    **${command.id}**`);
          if (command.subCommands.size >= 1) helpText.push(getSubCommands(command, 2));
        });
        return null;
      });
    } else {
      client.registry.plugins.forEach(plugin => {
        helpText.push(`**${plugin.name}**`);
        plugin.commands.forEach(command => {
          helpText.push(`    **${command.id}**`);
          if (command.subCommands.size >= 1) helpText.push(getSubCommands(command, 2));
        });
      });
    }
    channel.sendMessage(helpText.join('\n'));
  }
}

class helpSub extends Command {
  constructor(command, Help) {
    super(command.id, null, Help);
    this.command = command;
  }
  message(message, author, channel) {
    channel.sendMessage(`Showing advanced help for **${this.command.id}**`);
  }
}

function getSubCommands(command, level) {
  let tabs = '';

  for (let i = 0; i < level; i++) tabs = `${tabs}${Tab}`;

  const subs = [];
  if (command.subCommands.size >= 1) {
    command.subCommands.forEach(sub => {
      subs.push(getSubCommands(sub, level++));
    });
    return subs;
  }

  return `${tabs}${command.id}`;
}

exports.defaultHelp = help;
exports.defaultHelpSub = helpSub;
