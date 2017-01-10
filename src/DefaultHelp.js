const Command = require('./structures/Command');
const Tab = '    ';

class help extends Command {
  constructor() {
    super('help', null);
  }

  message(message, author, channel, guild, client) {
    const helpText = [`Showing command list for **${message.member.displayName}**\n`];
    helpText.push('**Global Commands**');
    client.registry.commands.forEach(command => {
      if (command.id !== 'help') {
        helpText.push(`    **${command.id}**`);
        if (command.subCommands.size >= 1) helpText.push(getSubCommands(command, 2));
      }
    });
    if (guild.commands.size >= 1) {
      helpText.push('\n**Custom Commands**');
      guild.commands.forEach(command => {
        helpText.push(`    **${command.id}**`);
      });
    }


    client.registry.plugins.forEach(plugin => {
      if (guild.enabledPlugins.indexOf(plugin.id) === -1 && client.options.guildConfigs === true) return null;
      helpText.push(`\n**${plugin.name}**`);
      plugin.commands.forEach(command => {
        helpText.push(`    **${command.id}**`);
        if (command.subCommands.size >= 1) helpText.push(getSubCommands(command, 2));
      });
      return null;
    });
    channel.sendMessage(helpText.join('\n'));
  }
}

class helpSub extends Command {
  constructor(command, Help) {
    super(command.id, null, {}, Help);
    this.setAlias(command.names);
    this.usage = command.usage;
    this.description = command.description;
  }
  message(message, author, channel, guild) {
    channel.sendMessage(`**Showing more info for:** \`${this.id}\`\n**Aliases:** ${this.names}\n**Description:** ${this.description}\n**Usage:** \`${guild.prefix}${this.usage}\``);
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

exports.help = help;
exports.helpSub = helpSub;
