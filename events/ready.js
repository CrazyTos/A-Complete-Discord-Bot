const { allCommands } = require('../utils/allCommands');

module.exports = async (client) => {
    client.user.setUsername(process.env.BOT_NAME);
    client.user.setActivity('Life :3', { type: 'LISTENING' });
    client.user.setStatus('dnd'); // online | idle | dnd | invisible

    console.log(`Bot: ${client.user.username}, ${client.guilds.cache.size} Servers`);
    console.log('\n\n');

    // Set Commands in Global
    if (JSON.parse(process.env.COMMANDS_GLOBAL)) {
        client.application.commands.set(allCommands());
    }
    // Set Commands in Guild
    else if (process.env.COMMANDS_GUILD.length > 7) {
        client.guilds.cache.get(process.env.COMMANDS_GUILD).commands.set(allCommands());
    }
};
