const Guild = require('./models/guild');
/**
 * This is the CommandRegistry holds all of the commands in the world
 *
 */
class CommandRegistry {

    constructor() {
        this.plugins = new Map();
        this.commands = new Map();
        this.aliases = new Map();
    }

    reloadPlugin(plugin) {

    }

    registerPlugin(plugin) {
        this.plugins.set(plugin.id, plugin);
    }

    registerAlias(command, alias) {
        this.aliases.set(alias, command);
    }

    registerCommand(command) {
        if (command.Message == null) {
            console.log("No message generator supplied");
        } else if (!Object.getPrototypeOf(command) === CommandObj) {
            return new Error("can not register non-command object");
        }
        this.commands.set(command.id, command)
    }
}

module.exports = CommandRegistry;
