const Forge = require('../');
const auth = require('./auth.json');
const Client = new Forge.ForgeClient({ selfBot: true});

console.log(auth);
class testCommand extends Forge.Command {
  constructor(commandRegistry) {
    super("test", "This is a test", commandRegistry);
  }

}
class testFunctionCommand extends Forge.Command {
  constructor(commandRegistry) {
    super("testFunction", null, commandRegistry);

  }
  Message(message, author, channel, guild, client) {
      channel.sendMessage(`Hey ${author.username}, Does this work?`);
      message.delete();
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

  Client.registry.registerCommand(new testCommand(Client.registry));
  Client.registry.registerCommand(new testFunctionCommand(Client.registry));
});

Client.on('error', console.log);
Client.on('debug', console.log);

Client.login(auth.token).then(() => {
  console.log("Logged in");
  Client.handleCommands();
}).catch(console.log);
