require('dotenv').config();
const fs = require('fs');
const { Collection, Client, Intents } = require('discord.js');
const { loadLanguages } = require('./utils/language');
const mongoose = require('mongoose');

// DB Connection
mongoose
    .connect(process.env.MONGOOSE, {
        useFindAndModify: false,
        useUnifiedTopology: true,
        useNewUrlParser: true,
    })
    .then(console.log('[Mongoose] Conected!'));

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.GUILD_INVITES,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    ],
    owner: process.env.ONWER_ID,
    commandPrefix: process.env.PREFIX,
});

loadLanguages();
client.commands = new Collection();

fs.readdirSync('./commands')
    .filter(
        (dir) =>
            fs.existsSync(`./commands/${dir}`) && fs.lstatSync(`./commands/${dir}`).isDirectory()
    )
    .forEach((commandSubFolder) => {
        fs.readdirSync(`./commands/${commandSubFolder}`)
            .filter((file) => file.endsWith('.js'))
            .forEach((commandFile) => {
                const command = require(`./commands/${commandSubFolder}/${commandFile}`);
                command.group = commandSubFolder.toLowerCase();
                console.log(`[Commands] Loaded: ${command.name}`);
                client.commands.set(command.name, command);
            });
    });

fs.readdirSync('./events')
    .filter((files) => files.endsWith('.js'))
    .forEach((eventFile) => {
        const eventName = eventFile.split('.')[0];
        const event = require(`./events/${eventFile}`);
        console.log(`Event ${eventName} Loaded !`);
        client.on(eventName, event.bind(null, client));
    });

client.login(process.env.DISCORD_TOKEN);
