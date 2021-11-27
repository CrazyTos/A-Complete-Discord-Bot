const {
	getGuildCommandsPermissions,
	setGuildCommandPermissions,
} = require('../deployCommands/guildCommands');


module.exports = {
	name: 'roleDelete',
	once: false,
	async execute(role) {
		await removeRoleFromCommands(role);
	},
};


/**
 * @typedef {import('discord.js').Role} Role
 * @param {Role} role
 */
async function removeRoleFromCommands(role) {
	const apiAllCommandsPermissions = await getGuildCommandsPermissions(role.guild.id);

	apiAllCommandsPermissions.forEach(async (c) => {
		if (!c.permissions.length) { return; }

		// command has Role
		const permissionsMatchRole = c.permissions.filter(
			(p) => (p.id === role.id));
		if (!permissionsMatchRole.length) { return; }

		// Remove role
		const newCommandPermissions = c.permissions.filter(
			(p) => (p.id !== role.id));

		// Set new Permissions in Command
		await setGuildCommandPermissions(role.guild.id, c.id, newCommandPermissions);
	});
}