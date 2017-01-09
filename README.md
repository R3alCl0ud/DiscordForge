# DiscordForge
[![NPM](https://nodei.co/npm/DiscordForge.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/DiscordForge/)

[![Build Status](https://travis-ci.org/R3alCl0ud/DiscordForge.svg?branch=master)](https://travis-ci.org/R3alCl0ud/DiscordForge)
A highly extensible command client for discord.js
# Example Usage

```js
const { Client, Command } = Forge = require('DiscordForge');
const ForgeClient = new Client({selfBot: true, prefix: "/"});

class evalCommand extends Command {
  constructor(registry) {
    super("eval", null);
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
ForgeClient.on('ready', () => {
  console.log('Ready');
})

ForgeClient.registry.registerCommand(new evalCommand());
ForgeClient.login("email", "password").catch(console.log);

```

[Documentation](https://r3alcl0ud.github.io/DiscordForge/master/)
