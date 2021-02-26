require('dotenv').config();
const fs = require('fs');
const discord = require('discord.js');
const client = new discord.Client({ disableMentions: 'everyone' });
const emojis = require('./utils/emojis');


client.commands = new discord.Collection();
client.emotes = emojis;


fs.readdirSync('./events').filter(files => files.endsWith('.js')).forEach(event_file => {
    const eventName = file.split(".")[0];
    const event = require(`./events/${event_file}`);
    client.on(eventName, event.bind(null, client));
});

fs.readdirSync('./commands').forEach(directory => {
    const commands = fs.readdirSync(`./commands/${directory}`).filter(files => files.endsWith('.js'));
    for (file of commands) {
        const command = require(`./commands/${directory}/${file}`);
        client.commands.set(command.name.toLowerCase(), command);
    }
});

client.login(process.env.DISCORD_TOKEN);
