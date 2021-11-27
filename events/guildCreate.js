const {
	updateGuildCommandsPermissions,
	deleteAllGuildCommand,
	addGuildCommands,
} = require('../utils/guilds-utils');


module.exports = {
	name: 'guildCreate',
	once: false,
	async execute(guild) {
		// Delete All commands if already exist.
		await deleteAllGuildCommand(guild.id);

		// Add All commands
		await addGuildCommands(guild.id, guild.client.commands);

		// Update Permissions
		await updateGuildCommandsPermissions(
			guild.id, guild.client.commands, guild.roles.cache);
	},
};

