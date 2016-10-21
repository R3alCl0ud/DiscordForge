/**
 *  This is the chat handling class file. This is the command running code. Very finiky
 *
 */
class commandHandler {

  constructor(client) {
    this.client = client;
  }

  handleMessage(message, author, channel, guild) {
    console.log("Message?");

    if (author.bot) return;
    if (this.client.options.selfBot === true && author.id !== this.client.user.id) return;
    if (this.client.options.perGuild === true && channel.type === "text") return this.perGuild(message, author, channel, guild);
    if (channel.type === "group") return this.handleGroupDM(message, author, channel);
    if (channel.type === "dm") return this.handleDM(message, author, channel);
    let cmdArgs = message.content.split(' ');

    if (channel.type === "text") {
      console.log(guild.name, guild.prefix);
      if (cmdArgs[0].substring(0, guild.prefix.length) != guild.prefix) return;

      const command = this.isCommand(message);
      if (command) {
        if (typeof command.Message === 'string') {
          channel.sendMessage(command.Message);
        } else if (command.Message) {
          command.Message(message, author, channel, guild, this.client);
        }
      }
    }
  }

  handleGroupDM(message, author, group) {

  }

  handleDM(message, author, dmChannel) {

  }

  perGuild(message, author, channel, guild) {
    const command = this.isCommand(message, true);
    if (command) {

    }
  }

  isCommand(message, perGuild = false) {
    let command;
    if (perGuild) {
      let args = message.content.split(" ");
      let label = args[0].substring(message.guild.prefix.length);
      label = plugin.aliases.get(label) || label;
      if ((command = this.client.registry.commands.get(label) !== null) || (command = this.client.registry.commands.get(label.toLowerCase()) !== null && !command.caseSensitive)) {
        console.log(args.length > 1, "Place");
        if (args.length > 1) return this.isSubCommand(args[1], command);
        return command;
      }
      this.client.registry.plugins.forEach(plugin => {
        if (message.guild.enabledPlugins.indexOf(plugin.id) !== -1) {
          if ((command = plugin.commands.get(label) !== null) || (command = plugin.commands.get(label.toLowerCase()) !== null && !command.caseSensitive)) {
            if (args.length > 1) return this.isSubCommand(args[1], command);
            return command;
          }
        }
      });
      return null;
    } else {
      let args = message.content.split(" ");
      let label = args[0].substring(message.guild.prefix.length);

      label = this.client.registry.aliases.get(label) || label;
      console.log(label);
      if ((command = this.client.registry.commands.get(label)) !== undefined || (command = this.client.registry.commands.get(label.toLowerCase())) !== undefined && !command.caseSensitive) {
        console.log(args.length > 1, "Place");
        if (args.length > 1) return this.isSubCommand(args.splice(0, 1), command);
        console.log(command);
        return command;
      }

      this.client.registry.plugins.forEach(plugin => {
        label = plugin.aliases.get(label) || label;
        if ((command = plugin.commands.get(label) !== null) || (command = plugin.commands.get(label.toLowerCase()) !== null && !command.caseSensitive)) {
          if (args.length > 1) return this.isSubCommand(args.splice(0, 1), command);
          return command;
        }
      });
      return null;
    }
  }

  isSubCommand(args, command) {
    let id = command.subCommandAliases.get(args[0]) || args[0];
    let subCommand;
    if ((subCommand = command.subCommands.get(id) !== null) || (subCommand = command.subCommands.get(id.toLowerCase()) && !subCommand.caseSensitive)) {
      if (args.length > 1) return this.isSubCommand(args.splice(0, 1), command);
      return subCommand;
    }
  }

  _handleMessage() {
    return function (message) {
      const { author, channel, guild } = message;
      let cmdArgs = message.content.split(' ');

      if (author.bot) return;

      console.log(`${author.username}: ${message.createdTimestamp}: ${channel.id}`)
      if (guild != null) {
        if (cmdArgs[0].substring(0, guild.prefix.length) != guild.prefix) return;
        cmdArgs[0] = cmdArgs[0].substring(guild.prefix.length);
        let plugins = [];
        for (const plugin in guild.enabledPlugins) {
          plugins.push(guild.enabledPlugins[plugin]);
        }
        if (plugins.indexOf('custom') != -1) {
          if (guild.commands.has(cmdArgs[0])) {
            const command = guild.commands.get(cmdArgs[0]);
            console.log(command.id);
            if (typeof command.Message === 'string') {
              return channel.sendMessage(command.Message);
            } else if (typeof command.Message === 'function') {
              return command.Message(message, author, channel, guild, this.client);
            }
          }
        }


        for (const enabled in plugins) {
          const plugin = this.client.registry.plugins.get(plugins[enabled])
          if (typeof plugin !== "object") continue;
          if ((plugin.commands.has(cmdArgs[0]) || plugin.aliases.has(cmdArgs[0])) || ((plugin.commands.has(cmdArgs[0].toLowerCase()) && !plugin.commands.get(cmdArgs[0].toLowerCase()).caseSensitive) || (plugin.aliases.has(cmdArgs[0].toLowerCase()) && !plugin.commands.get(plugin.aliases.get(cmdArgs[0].toLowerCase())).caseSensitive))) {
            console.log("Found the command");
            const command = plugin.commands.get(cmdArgs[0]) || plugin.commands.get(plugin.aliases.get(cmdArgs[0])) || plugin.commands.get(cmdArgs[0].toLowerCase()) || plugin.commands.get(plugin.aliases.get(cmdArgs[0].toLowerCase()));
            console.log(`plugin: ${plugins[enabled]}, command: ${command.id}, used by: ${author.username}`);
            try {
              if (command.subCommands.size > 0 && cmdArgs.length > 1) {
                if ((command.subCommands.has(cmdArgs[1]) || command.subCommandsAliases.has(cmdArgs[1])) || (command.subCommands.has(command.subCommandsAliases.get(cmdArgs[1].toLowerCase())) && !command.subCommands.get(command.subCommandsAliases.get(cmdArgs[1].toLowerCase())).caseSensitive)) {
                  const subCommand = command.subCommands.get(cmdArgs[1]) || command.subCommands.get(command.subCommandsAliases.get(cmdArgs[1])) || command.subCommands.get(cmdArgs[1].toLowerCase()) || command.subCommands.get(command.subCommandsAliases.get(cmdArgs[1].toLowerCase()));
                  if (typeof subCommand.Message === 'string') {
                    return channel.sendMessage(subCommand.Message);
                  } else if (typeof subCommand.Message === 'function') {
                    return subCommand.Message(message, author, channel, guild, this.client);
                  }
                }
              }
              if (typeof command.Message === 'function') {
                command.Message(message, author, channel, guild, this.client);
              } else if (typeof command.Message === 'string') {
                channel.sendMessage(command.Message).catch(console.log);
              }
            } catch (error) {
              console.log(error)
            }
          }
        }
      }
    }.bind(this);
  }
}


module.exports = commandHandler;
