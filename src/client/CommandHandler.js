/**
 *  This is the chat handling class file. This is the command running code. Very finiky
 *
 */
class CommandHandler {
  constructor(client) {
    this.client = client;
  }

  handleMessage(message, channel) {
    if (message.author.bot) return this.client.emit('plainMessage', message);
    if (this.client.options.selfBot === true && message.author.id !== this.client.user.id) return this.client.emit('plainMessage', message);
    if (this.client.options.guildConfigs === true && channel.type === 'text') return this.perGuild(message, channel);
    if (channel.type === 'dm' || (channel.type === 'group' && this.client)) return this.handleDM(message, channel);
    let cmdArgs = message.content.split(' ');
    if (channel.type === 'text') {
      if (cmdArgs[0].substring(0, this.client.options.prefix.length) !== this.client.options.prefix) return this.client.emit('plainMessage', message);
      const command = this.getCommand(message);
      if (command !== undefined) {
        if (command.dmOnly === true) return this.client.emit('plainMessage', message);
        command.message(message, channel, cmdArgs.splice(1));
        return this.client.emit('command', command);
      }
    }
    return this.client.emit('plainMessage', message);
  }

  handleDM(message, GroupOrDMChannel) {
    let cmdArgs = message.content.split(' ');
    if (cmdArgs[0].substring(0, this.client.options.prefix.length) !== this.client.options.prefix) return false;
    const command = this.getCommand(message);
    if (command) {
      if (command.guildOnly === true) return false;

      command.message(message, GroupOrDMChannel, cmdArgs.splice(1));
      return this.client.emit('command', command);
    }
    return this.client.emit('plainMessage', message);
  }

  perGuild(message, channel) {
    let cmdArgs = message.content.split(' ');
    if (cmdArgs[0].substring(0, guild.prefix.length) !== guild.prefix) return this.client.emit('plainMessage', message);
    const command = this.getCommand(message, true);
    if (command) {
      if (command.dmOnly === true) return this.client.emit('plainMessage', message);
      command.message(message, channel, cmdArgs.splice(1));
      return this.client.emit('command', message, command);
    }
    return this.client.emit('plainMessage', message);
  }

  /**
   * Checks if a message is a command
   * @param {Message} message The message to get the command from
   * @param {boolean} guildConfigs Whether or not custom configs is enabled
   * @returns {?Command}
   */
  getCommand(message, guildConfigs = false) {
    let command = null;
    let args = message.content.split(' ');
    let label = guildConfigs ? args[0].substring(message.guild.prefix.length) : args[0].substring(this.client.options.prefix.length);
    if (guildConfigs) {
      message.guild.commands.forEach(cmd => { command = this.testComparator(cmd, label) ? cmd : label === cmd.id ? cmd : command; });
      this.client.registry.commands.forEach(cmd => { command = this.testComparator(cmd, label) ? cmd : label === cmd.id ? cmd : command; });
      this.client.registry.plugins.forEach(plugin => {
        if (message.guild.enabledPlugins.indexOf(plugin.id) !== -1) plugin.commands.forEach(cmd => { command = this.testComparator(cmd, label) ? cmd : label === cmd.id ? cmd : command; });
      });
    } else {
      this.client.registry.commands.forEach(cmd => { command = this.testComparator(cmd, label) ? cmd : label === cmd.id ? cmd : command; });
      this.client.registry.plugins.forEach(plugin => {
        plugin.commands.forEach(cmd => { command = this.testComparator(cmd, label) ? cmd : label === cmd.id ? cmd : command; });
      });
    }
    args.splice(0, 1);
    if (args.length > 0 && command !== null) return this.getSubCommand(args, command);
    return command;
  }

  getSubCommand(args, command) {
    let id = command.subCommandAliases.get(args[0]) || args[0];
    let subCommand;
    if (((subCommand = command.subCommands.get(id)) !== undefined) || ((subCommand = command.subCommands.get(id.toLowerCase())) !== undefined && subCommand.caseSensitive === false)) {
      args.splice(0, 1);
      if (args.length >= 1 && subCommand !== undefined) return this.getSubCommand(args, subCommand);
      return subCommand;
    }
    return command;
  }

  testComparator(cmd, label) {
    let command;
    if (typeof cmd.comparator === 'string') {
      if (label === cmd.comparator) command = cmd;
    } else if (cmd.comparator instanceof RegExp) {
      if (cmd.comparator.test(label)) command = cmd;
    } else if (cmd.comparator instanceof Array) {
      cmd.comparator.forEach(comp => {
        if (typeof comp === 'string') {
          if (label === comp) command = cmd;
        } else if (comp instanceof RegExp) {
          if (comp.test(label)) command = cmd;
        }
      });
    }
    return !!command;
  }
}


module.exports = CommandHandler;
