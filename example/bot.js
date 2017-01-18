const Forge = require('../');
const Client = new Forge.Client();
const customPlugin = require('plugins/plugin');

Client.on('ready', () => {
  Client.registry.registerPlugin(new customPlugin());
});

Client.login('token').catch(console.log);
