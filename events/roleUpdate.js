const {
	getGuildCommands,
	removeRoleGuildCommandPermission,
	addRoleGuildCommandPermissions,
} = require('../deployCommands/guildCommands');


module.exports = {
	name: 'roleUpdate',
	once: false,
	async execute(oldRole, newRole) {
		await updateCommandsPermissions(newRole);
	},
};

async function updateCommandsPermissions(newRole) {
	const rolePermissionsArr = newRole.permissions.toArray();
	const clientCommands = newRole.guild.client.commands;
	const apiAllCommands = await getGuildCommands(newRole.guild.id);

	const commandsWithPermissions = clientCommands.filter((c) => (c.userPermissions.length));
	const commandsWithMatchingPermissions = commandsWithPermissions.filter(
		(c) => c.userPermissions.every(r => rolePermissionsArr.includes(r)),
	);


	// Remove Role from incompatible commands
	const commandsForRemoveRole = commandsWithPermissions.filter(
		(c) => (!commandsWithMatchingPermissions.get(c.data.name)));
	const apiCommandsForRemoveRole = apiAllCommands.filter(
		(c) => (commandsForRemoveRole.has(c.name)));
	apiCommandsForRemoveRole.forEach(async (c) => {
		await removeRoleGuildCommandPermission(newRole.guild.id, c.id, newRole.id);
	});


	// add Role in Mathing Commands Permissions
	const apiCommandsForAddRole = apiAllCommands.filter(
		(c) => (commandsWithMatchingPermissions.get(c.name)));
	apiCommandsForAddRole.forEach(async (c) => {
		await addRoleGuildCommandPermissions(newRole.guild.id, c.id, newRole.id);
	});
}