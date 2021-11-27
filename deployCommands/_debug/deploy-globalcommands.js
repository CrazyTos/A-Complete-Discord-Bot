const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config({ path: '../../.env' });

const globalCommands = [];

fs.readdirSync('../../commands')
	.filter(
		(dir) => fs.existsSync(`../../commands/${dir}`) &&
		fs.lstatSync(`../../commands/${dir}`).isDirectory())
	.forEach((commandSubFolder) => {
		fs.readdirSync(`../../commands/${commandSubFolder}`)
			.filter((file) => file.endsWith('.js'))
			.forEach((commandFile) => {
				const command = require(`../../commands/${commandSubFolder}/${commandFile}`);
				if (command.globalCommand) {
					globalCommands.push(command.data.toJSON());
				}
			});
	});

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);

// rest.put(Routes.applicationCommands(process.env.APP_ID, process.env.GUILD_ID), {
// 	body: globalCommands,
// })
// 	.then(() => console.log('Successfully registered application commands.'))
// 	.catch(console.error);


// Get Global Commands
// rest.get(Routes.applicationCommands(process.env.APP_ID)).then((cmd) => {
// 	console.log(cmd);
// }).catch(console.error);


// Delete Global Command
// rest.delete(Routes.applicationCommand(
// 	process.env.APP_ID, '910274568621543514')).then((cmd) => {
// 	console.log(cmd);
// }).catch(console.error);