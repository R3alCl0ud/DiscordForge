const Forge = require('../');
const auth = require('./auth.json');
const Client = new Forge.ForgeClient();

class testCommand extends Forge.Command {
  constructor(commandRegistry) {
    super("test", "This is a test", commandRegistry);
  }

}
class testFuctionCommand extends Forge.Command {
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
  console.log(`Channel 1: ${Client.channels.first().id}`)
  Client.user.setGame("Self Bot");

  Client.registry.registerCommand(new testCommand(Client.registry));
});

Client.login("MTc3NDQ1OTIzMzQ4MDIxMjQ4.CuvYwQ.aQIs2vs906k_6FGb0QBmolIMFOU").then(() => {
  console.log("Logged in");
}).catch(console.log);
Client.handleCommands();
Client.on('error', console.log);
Client.on('debug', console.log);
