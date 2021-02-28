require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { Client } = require('discord.js-commando');
const { emojis } = require('./utils/emojis');
const { loadLanguages } = require('./utils/language');

const client = new Client({
    owner: process.env.ONWER_ID,
    commandPrefix: process.env.PREFIX,
});

loadLanguages();
client.emotes = emojis;

// Configure Commands
client.registry
    .registerGroups([
        ['info', 'Info Commands.'],
    ])
    .registerCommandsIn(path.join(__dirname, 'commands'));

fs.readdirSync('./events').filter((files) => files.endsWith('.js')).forEach((eventFile) => {
    const eventName = eventFile.split('.')[0];
    const event = require(`./events/${eventFile}`);
    client.on(eventName, event.bind(null, client));
});

client.login(process.env.DISCORD_TOKEN);
