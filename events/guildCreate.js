const {
	updateGuildCommandsPermissionsRole,
	deleteAllGuildCommands,
	addGuildCommands,
} = require('../utils/guilds-utils');


module.exports = {
	name: 'guildCreate',
	once: false,
	async execute(guild) {
		// Delete All commands if already exist.
		await deleteAllGuildCommands(guild.id);

		// Add All commands
		await addGuildCommands(guild.id, guild.client.commands);

		// Update Permissions
		await updateGuildCommandsPermissionsRole(
			guild.id, guild.client.commands, guild.roles.cache);
	},
};

