const { checkAndUpdateGuildsCommands } = require('../utils/guilds-utils');
const {
	loadGuildsLanguages,
	loadLanguagesTexts,
} = require('../utils/languages-utils');


module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		/* If the bot is added to the guild while it is offline,
		this function will ensure that commands are added to the guild. */
		await checkAndUpdateGuildsCommands(client.guilds.cache);

		await loadGuildsLanguages(client);
		await loadLanguagesTexts();

		console.log(`Ready! Logged in as : ${client.user.tag}`);
	},
};