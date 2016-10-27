const Forge = require('../');
const auth = require('./auth.json');

const ExamplePlugin = require('./selfPlugin');
const Client = new Forge.ForgeClient({prefix: "//", guildConfigs: true});

console.log(auth);
class testCommand extends Forge.Command {
  constructor(commandRegistry) {
    super("test", "This is a test", commandRegistry);
  }

}
class evalCommand extends Forge.Command {
  constructor(registry) {
    super("eval", null, registry);
  }
  message(message, author, channel, guild, client) {
    try {
      const com = eval(message.content.split(' ').slice(1).join(' '));
      channel.sendMessage('```\n' + com + '```');
    } catch (e) {
      channel.sendMessage('```\n' + e + '```');
    }
  }
}

class testPrefix extends Forge.Command {
  constructor(commandRegistry) {
    super("testPrefix", null, commandRegistry);
  }
  message(message, author, channel, guild) {
      channel.sendMessage(`Hey ${author.username}, The guilds prefix is ${guild.prefix}?`);
      message.delete();
  }
}

class testChangeConfig extends Forge.Command {
  constructor(commandRegistry) {
    super("testConfig", null, commandRegistry);
  }
  message(message, author, channel, guild) {
      channel.sendMessage(`Hey ${author.username}, The guilds current prefix is ${guild.prefix}?`);
      guild.changePrefix(message.content.split(' ')[1]);
      channel.sendMessage(`I changed the prefix to ${guild.prefix}`);
  }
}

Client.on('disconnect', ()=> {
  console.log("disconnect")
})

Client.on('reconnecting', ()=> {
  console.log("reconnect")
})

Client.on('ready', () => {
  console.log(`Bot: ${Client.user.bot}`)
  console.log(`Guilds: ${Client.guilds.size}`);
  console.log(`Channels: ${Client.channels.size}`);
  Client.user.setGame("Self Bot");


});

Client.on('error', console.log);
Client.on('debug', console.log);

Client.login(auth.token).then(() => {
  console.log("Logged in");
  Client.registry.registerCommand(new testChangeConfig(Client.registry));
  Client.registry.registerCommand(new testPrefix(Client.registry));
  Client.registry.registerCommand(new evalCommand(Client.registry));
  Client.registry.registerPlugin(new ExamplePlugin(Client));
  console.info(Client.registry.plugins.get("testPlugin").comands);
}).catch(console.log);
