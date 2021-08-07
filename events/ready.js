module.exports = async (client) => {
    client.user.setUsername(process.env.BOT_NAME);
    client.user.setActivity('Life :3', { type: 'LISTENING' });
    client.user.setStatus('dnd'); // online | idle | dnd | invisible

    console.log(`Bot: ${client.user.username}, ${client.guilds.cache.size} Servers`);
    console.log('\n\n');
};
