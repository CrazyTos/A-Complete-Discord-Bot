const { Client, Intents, Collection } = require('discord.js');
const { getLanguagesList } = require('./utils/languages-utils');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

// Adding to the client
client.commands = new Collection();
client.database = require('./database/mongoose-schemas.js');
client.languagesList = getLanguagesList();

// Set commands in client.commands
fs.readdirSync('./commands')
	.filter(
		(dir) => fs.existsSync(`./commands/${dir}`) &&
		fs.lstatSync(`./commands/${dir}`).isDirectory())
	.forEach((commandSubFolder) => {
		fs.readdirSync(`./commands/${commandSubFolder}`)
			.filter((file) => file.endsWith('.js'))
			.forEach((commandFile) => {
				const command = require(`./commands/${commandSubFolder}/${commandFile}`);
				command.group = commandSubFolder.toLowerCase();
				client.commands.set(command.data.name, command);
			});
	});


// Events
fs.readdirSync('./events').filter(file => file.endsWith('.js'))
	.forEach((eventFile) => {
		const event = require(`./events/${eventFile}`);
		if (event.once) {
			client.once(event.name, (...args) => event.execute(...args));
		}
		else {
			client.on(event.name, (...args) => event.execute(...args));
		}
		console.log('[EVENT] loaded : ' + event.name);
	});


client.login(process.env.DISCORD_TOKEN);
