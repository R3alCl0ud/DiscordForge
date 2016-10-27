# Discord-Forge
[![NPM](https://nodei.co/npm/DiscordForge.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/DiscordForge/)

[![Build Status](https://travis-ci.org/R3alCl0ud/Discord-Forge.svg?branch=master)](https://travis-ci.org/R3alCl0ud/Discord-Forge)
A highly extensible command client for discord.js
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

Client.registry.registerCommand(new evalCommand(Client.registry));
Client.login("email", "password").catch(console.log);

```
