const Command = require('./structures/Command');
const Tab = '    ';

class help extends Command {
  constructor() {
    super('help', null);
    this.loaded = false;
  }

  message(message, channel) {
    if (!this.loaded) {
      this.client.registry.plugins.forEach(plugin => {
        plugin.commands.forEach(this.client.loadHelp.bind(this.client));
      });
      this.loaded = true;
    }

    const helpText = [`Showing command list for **${message.member.displayName}**\n`];
    helpText.push('**Global Commands**');
    this.client.registry.commands.forEach(command => {
      if (command.id !== 'help') {
        helpText.push(`    **${command.id}**`);
        if (command.subCommands.size >= 1) helpText.push(getSubCommands(command, 2));
      }
    });
    if (message.guild.commands.size >= 1) {
      helpText.push('\n**Custom Commands**');
      message.guild.commands.forEach(command => {
        helpText.push(`    **${command.id}**`);
      });
    }


    this.client.registry.plugins.forEach(plugin => {
      if (message.guild.enabledPlugins.indexOf(plugin.id) === -1 && this.client.options.guildConfigs === true) return null;
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
    super(command.id, Help);
    this.setAlias(command.comparator);
    this.usage = command.usage;
    this.description = command.description;
    this.perms = command.permissions.join(', ') + command.role;
  }

  response(message, channel) {
    const { client, guild } = message;
    let text = `**Showing more info for:** \`${this.id}\`
**Aliases:** ${this.names.join(', ') + this.comparator.join(', ')}
**Required Permissions and/or role:** ${this.perms}
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
