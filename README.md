# DiscordForge
[![NPM](https://nodei.co/npm/DiscordForge.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/DiscordForge/)

[![Build Status](https://travis-ci.org/R3alCl0ud/DiscordForge.svg?branch=master)](https://travis-ci.org/R3alCl0ud/DiscordForge)
A highly extensible command client for discord.js
# Example Usage

```js
const Forge = require('DiscordForge');
const Client = new Forge.Client({selfBot: true, prefix: "/"});

class evalCommand extends Forge.Command {
  constructor() {
    super({ id: 'eval', description: 'eval command', permissions: ['SEND_MESSAGES'], role: ['@everyone'], comparator: ['eval'] });
  }
  response(message, channel, args) {
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
});

Client.registry.registerCommand(new evalCommand());
Client.login("token").catch(console.log);

```

[Documentation](https://r3alcl0ud.github.io/DiscordForge/master/)
