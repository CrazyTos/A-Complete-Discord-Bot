const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config({ path: '../../.env' });

const guildCommandsData = [];
const guildCommands = [];

fs.readdirSync('../../commands')
	.filter(
		(dir) => fs.existsSync(`../../commands/${dir}`) &&
		fs.lstatSync(`../../commands/${dir}`).isDirectory())
	.forEach((commandSubFolder) => {
		fs.readdirSync(`../../commands/${commandSubFolder}`)
			.filter((file) => file.endsWith('.js'))
			.forEach((commandFile) => {
				const command = require(`../../commands/${commandSubFolder}/${commandFile}`);
				if (!command.globalCommand) {
					guildCommandsData.push(command.data.toJSON());
					guildCommands.push(command);
				}
			});
	});

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);


// rest.put(Routes.applicationGuildCommands(process.env.APP_ID, process.env.GUILD_ID), {
// 	body: guildCommandsData,
// })
// 	.then(() => console.log('Successfully registered Guild commands.'))
// 	.catch(console.error);

// Get Global/Guild Commands
rest.get(Routes.applicationGuildCommands(process.env.APP_ID, '725161555406225468')).then((cmd) => {
	console.log(cmd);
}).catch(console.error);


// Delete Command
// rest.delete(
// 	Routes.applicationGuildCommand(
// 		process.env.APP_ID,
// 		process.env.GUILD_ID,
// 		'908101063108862004',
// 	),
// ).then((e) => console.log(e));


// Get command Permissions 910277495075536966
rest.get(Routes.applicationCommandPermissions(process.env.APP_ID, '725161555406225468', '910277495075536966')).then((cmd) => {
	console.log(cmd);
}).catch(console.error);
