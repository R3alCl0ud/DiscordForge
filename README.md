# Discord-Forge


# Example Usage

```js
const Forge = require('DiscordForge');
const Client = new Forge.Client({selfBot: true, prefix: "/"});

class evalCommand extends Forge.Command {
  constructor(registry) {
    super("eval", null, registry);
  }
  Message(message, author, channel, guild, client) {
    try {
      const com = eval(message.content.split(' ').slice(1).join(' '));
      channel.sendMessage('```\n' + com + '```');
    } catch (e) {
      channel.sendMessage('```\n' + e + '```');
    }
  }
}
Client.on('ready', () => {
  console.log('Ready');
})

Client.login("email", "password").then(() => {
  Client.registry.registerCommand(new evalCommand(Client.registry));
}).catch(console.log);

```
