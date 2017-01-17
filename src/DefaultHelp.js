const Command = require('./structures/Command');
const Tab = '    ';

class help extends Command {
  constructor() {
    super({ id: 'help',
        description: 'the default help command',
        permissions: ['SEND_MESSAGES'],
        role: '@everyone',
        comparator: ['help'],
      });
    this.loaded = false;
  }

  response(message, channel) {
    if (!this.loaded) {
      this.client.registry.plugins.forEach(plugin => {
        plugin.commands.forEach(this.client.loadHelp.bind(this.client));
      });
      this.loaded = true;
    }

    const helpText = [`Showing command list for **${message.member ? message.member.displayName : message.author.username}**\n`];
    helpText.push('**Global Commands**');
    this.client.registry.commands.forEach(command => {
      if (command.id !== 'help') {
        helpText.push(`    **${command.id}**`);
        if (command.subCommands.size >= 1) helpText.push(getSubCommands(command, 2));
      }
    });
    if (message.guild && message.guild.commands.size >= 1) {
      helpText.push('\n**Custom Commands**');
      message.guild.commands.forEach(command => {
        helpText.push(`    **${command.id}**`);
      });
    }


    this.client.registry.plugins.forEach(plugin => {
      if (message.guild && message.guild.enabledPlugins.indexOf(plugin.id) === -1 && this.client.options.guildConfigs === true) return null;
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
    super({ id: command.id,
        description: command.description,
        permissions: ['SEND_MESSAGES'],
        role: '@everyone',
        comparator: command.comparator,
      }, Help);
    this.setAlias(command.comparator);
    this.perms = command.permissions;
  }

  response(message, channel) {
    const { client, guild } = message;
    let text = `**Showing more info for:** \`${this.id}\`
**Aliases:** ${this.comparator.join(', ')}
**Required Permissions and/or role:** ${this.perms.join(', ')}
**Description:** ${this.description}
**Usage:** \`${guild ? guild.prefix : client.options.prefix}${this.usage}\``;
    channel.sendMessage(text, { disableEveryone: true });
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

  return `${tabs}**${command.id}**`;
}

exports.help = help;
exports.helpSub = helpSub;
