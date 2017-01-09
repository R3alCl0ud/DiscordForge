/**
 *  This is the chat handling class file. This is the command running code. Very finiky
 *
 */
class CommandHandler {
  constructor(client) {
    this.client = client;
  }

  handleMessage(message, author, channel, guild) {
    if (author.bot) return this.client.emit('plainMessage', message);
    if (this.client.options.selfBot === true && author.id !== this.client.user.id) return this.client.emit('plainMessage', message);
    if (this.client.options.guildConfigs === true && channel.type === 'text') return this.perGuild(message, author, channel, guild);
    if (channel.type === 'group') return this.handleGroupDM(message, author, channel);
    if (channel.type === 'dm') return this.handleDM(message, author, channel);
    let cmdArgs = message.content.split(' ');
    if (channel.type === 'text') {
      if (cmdArgs[0].substring(0, this.client.options.prefix.length) !== this.client.options.prefix) return this.client.emit('plainMessage', message);

      const command = this.getCommand(message);
      if (command !== undefined) {
        if (command.dmOnly === true) return this.client.emit('plainMessage', message);
        if (typeof command.message === 'string') {
          channel.sendMessage(command.message);
        } else if (typeof command.message === 'function') {
          command.message(message, author, channel, guild, this.client);
        } else if (command.responses.length > 1) {
          let response = command.responses[Math.random() * (command.responses.length - 1)];
          if (typeof response === 'string') {
            channel.sendMessage(response);
          } else if (typeof response === 'function') {
            response(message, author, channel, guild, this.client);
          }
        }
        return this.client.emit('command', command);
      }
    }
    return this.client.emit('plainMessage', message);
  }

  handleGroupDM(message, author, group) {
    let cmdArgs = message.content.split(' ');
    if (cmdArgs[0].substring(0, this.client.options.prefix.length) !== this.client.options.prefix) this.client.emit('plainMessage', message);
    const command = this.getCommand(message);
    if (command) {
      if (command.guildOnly === true) return this.client.emit('plainMessage', message);
      if (typeof command.message === 'string') {
        group.sendMessage(command.message);
      } else if (typeof command.message === 'function') {
        command.message(message, author, group, this.client);
      } else if (command.responses.length > 1) {
        let response = command.responses[Math.random() * (command.responses.length - 1)];
        if (typeof response === 'string') {
          group.sendMessage(response);
        } else if (typeof response === 'function') {
          response(message, author, group, this.client);
        }
      }
      return this.client.emit('command', command);
    }
    return this.client.emit('plainMessage', message);
  }

  handleDM(message, author, dmChannel) {
    let cmdArgs = message.content.split(' ');
    if (cmdArgs[0].substring(0, this.client.options.prefix.length) !== this.client.options.prefix) return false;
    const command = this.getCommand(message);
    if (command) {
      if (command.guildOnly === true) return false;
      // if (this.testPermissions(command, author))
      if (typeof command.message === 'string') {
        dmChannel.sendMessage(command.message);
      } else if (typeof command.message === 'function') {
        command.message(message, author, dmChannel, this.client);
      } else if (command.responses.length > 1) {
        let response = command.responses[Math.random() * (command.responses.length - 1)];
        if (typeof response === 'string') {
          dmChannel.sendMessage(response);
        } else if (typeof response === 'function') {
          response(message, author, dmChannel, this.client);
        }
      }
      return this.client.emit('command', command);
    }
    return this.client.emit('plainMessage', message);
  }

  perGuild(message, author, channel, guild) {
    let cmdArgs = message.content.split(' ');
    if (cmdArgs[0].substring(0, guild.prefix.length) !== guild.prefix) return this.client.emit('plainMessage', message);
    const command = this.getCommand(message, true);
    if (command) {
      if (command.dmOnly === true) return this.client.emit('plainMessage', message);
      if (typeof command.message === 'string') {
        channel.sendMessage(command.message);
      } else if (typeof command.message === 'function') {
        command.message(message, author, channel, guild, this.client);
      }
      /* else if (command.responses.length > 1) {
             let response = command.responses[Math.random() * (command.responses.length - 1)];
             if (typeof response === 'string') {
               return channel.sendMessage(response);
             } else if (typeof response === 'function') {
               return response(message, author, channel, guild, this.client);
             }
           }*/
      return this.client.emit('command', command);
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
    let command;
    let args = message.content.split(' ');
    let label = guildConfigs ? args[0].substring(message.guild.prefix.length) : args[0].substring(this.client.options.prefix.length);
    if (guildConfigs) {
      message.guild.commands.forEach(cmd => { command = this.testComparator(cmd, label) ? cmd : label === cmd.id ? cmd : command; });
      this.client.registry.commands.forEach(cmd => command = this.testComparator(cmd, label) ? cmd : label === cmd.id ? cmd : command);
      this.client.registry.plugins.forEach(plugin => {
        if (message.guild.enabledPlugins.indexOf(plugin.id) !== -1) plugin.commands.forEach(cmd => { command = this.testComparator(cmd, label) ? cmd : label === cmd.id ? cmd : command; });
      });
    } else {
      this.client.registry.commands.forEach(cmd => { command = this.testComparator(cmd, label) ? cmd : label === cmd.id ? cmd : command; });
      this.client.registry.plugins.forEach(plugin => {
        plugin.commands.forEach(cmd => { command = this.testComparator(cmd, label) ? cmd : label === cmd.id ? cmd : command; });
      });
    }
    if (args.length > 1) return this.getSubCommand(args.splice(0, 1), command);
    return command;
  }

  getSubCommand(args, command) {
    let id = command.subCommandAliases.get(args[0]) || args[0];
    let subCommand;
    if (((subCommand = command.subCommands.get(id)) !== undefined) || ((subCommand = command.subCommands.get(id.toLowerCase())) !== undefined && !subCommand.caseSensitive)) {
      if (args.length > 1) return this.getSubCommand(args.splice(0, 1), command);
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

  testPermissions(cmd, member) {
    return true;
  }
}


module.exports = CommandHandler;
