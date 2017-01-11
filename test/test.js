const Forge = require('../src');
const auth = require('./auth.json');
const ExamplePlugin = require('./selfPlugin');
const Client = new Forge.Client({ prefix: "//", guildConfigs: false});
const { Readable, Writable } = require('stream');
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
    channel.sendMessage(`Hey ${author.username}, The guilds prefix is \`${guild.prefix}\``);
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

Client.on('disconnect', () => {
  console.log("disconnect");
});

Client.on('reconnecting', () => {
  console.log("reconnect");
});

function handleHelp() {
  Client.registry.plugins.forEach(plugin => {
    plugin.commands.forEach(Client.loadHelp.bind(Client));
  });
}

Client.on('ready', () => {
  console.log(`Bot: ${Client.user.bot}`);
  console.log(`Guilds: ${Client.guilds.size}`);
  console.log(`Channels: ${Client.channels.size}`);
  // let con1, r1, con2, r2;
  // Client.channels.get("186722850353315841").join().then(v1 => {
  //   r1 = v1.createReceiver();
  //   Client.channels.get("245752795884552192").join().then(v2 => {
  //     r2 = v2.createReceiver();
  //     v1.on('speaking', (u,b) => {
  //       if (b) u.bot ? v2.playStream(r1.opusStreams.get(u.id) || r1.createOpusStream(u), {volume: 1}) :  v2.playConvertedStream(r1.pcmStreams.get(u.id) || r1.createPCMStream(u));
  //     });
  //     v2.on('speaking', (u,b) => {
  //       if (b) u.bot ? v1.playStream(r2.opusStreams.get(u.id) || r2.createOpusStream(u), {volume: 1}) :  v1.playConvertedStream(r2.pcmStreams.get(u.id) || r2.createPCMStream(u));
  //     });
  //   });
  // });
});

Client.on('error', console.log);
Client.on('debug', console.log);

Client.login(auth.token).then(() => {
  console.log("Logged in");
  // Client.registry.registerCommand(new testChangeConfig(Client.registry));
  // Client.registry.registerCommand(new testPrefix(Client.registry));
  // Client.registry.registerCommand(new evalCommand(Client.registry));
  Client.registry.registerPlugin(new ExamplePlugin(Client));
  // handleHelp();
  console.info(Client.registry.plugins.get("testPlugin").comands);
}).catch(console.log);
