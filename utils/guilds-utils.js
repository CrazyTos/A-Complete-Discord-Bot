const {
	getGuildCommands,
	getGuildCommandPermissions,
	setGuildCommandPermissions,
	addGuildCommandsJSON,
	deleteGuildCommand,
	addRoleGuildCommandPermissions,
} = require('../deployCommands/guildCommands');


/**
 * @param {String} guildID
 * @param {String} commandID
 * @param {String} roleID
 */
async function addGuildCommandPermissionsRole(guildID, commandID, roleID) {
	const commandPermissions = await getGuildCommandPermissions(guildID, commandID);
	// Insert role in Command Permissions
	commandPermissions.push({ id: roleID, type: 1, permission: true });
	await setGuildCommandPermissions(guildID, commandID, commandPermissions);
}

/**
 * @typedef {import('discord.js').Collection} Collection
 * @param {String} guildID
 * @param {Collection} clientCommands
 * @param {Collection} guildRoles
 */
async function updateGuildCommandsPermissionsRole(guildID, clientCommands, guildRoles) {
	const apiAllCommands = await getGuildCommands(guildID);
	const clientCommandsWithPermissions = clientCommands.filter(
		(c) => (c.userPermissions) && (c.userPermissions.length),
	);

	clientCommandsWithPermissions.forEach((c) => {
		// Roles match with this command
		const rolesForThisCommand = [];
		guildRoles.filter(
			(role) => {
				if (c.userPermissions.every(r => role.permissions.toArray().includes(r))) {
					rolesForThisCommand.push(role.id);
				}
			});

		for (let i = 0; i < rolesForThisCommand.length; i++) {
			const roleID = rolesForThisCommand[i];
			const command = apiAllCommands.filter((cmd) => (cmd.name === c.data.name));
			if (!command.length) { return; }

			// Insert role in Command Permissions
			addRoleGuildCommandPermissions(guildID, command[0].id, roleID);
		}
	});
}

/**
 * @param {String} guildID
 * @param {String} commandID
 * @param {String} RoleID
 */
async function removeGuildCommandPermissionRole(guildID, commandID, RoleID) {
	const commandPermissions = await getGuildCommandPermissions(guildID, commandID);
	const finalPermissions = commandPermissions.filter(
		(currentValue) => (currentValue.id !== RoleID),
	);
	// Set new Permissions List
	return await setGuildCommandPermissions(guildID, commandID, finalPermissions);
}


/**
 * @typedef {import('discord.js').Collection} Collection
 * @param {Collection} guilds
 */
async function checkAndUpdateGuildsCommands(guilds) {
	for (const [guildID, guild] of guilds) {
		const commands = await getGuildCommands(guildID);
		if (!commands.length) {
			// Add All commands
			await addGuildCommands(guildID, guild.client.commands);
			// Update Permissions
			await updateGuildCommandsPermissionsRole(
				guildID, guild.client.commands, guild.roles.cache);
			console.log('[Commands] Inserted the commands in the guild: '
                + guild.name + ' / ' + guildID);
			return;
		}

		// Update  [coming soon]
	}
}


/**
 * @param {String} guildID
 */
async function deleteAllGuildCommands(guildID) {
	const guildCommands = await getGuildCommands(guildID);
	if (!guildCommands.length) { return; }

	guildCommands.forEach((c) => {
		deleteGuildCommand(guildID, c.id);
	});
}


/**
 *
 * @typedef {import('discord.js').Collection} Collection
 * @param {String} guildID
 * @param {Collection} clientCommands
 */
async function addGuildCommands(guildID, clientCommands) {
	const guildClientCommands = clientCommands.filter(cmd => !cmd.globalCommand);
	const commadsJSON = [];
	guildClientCommands.forEach((cmd) => {
		commadsJSON.push(cmd.data.toJSON());
	});

	await addGuildCommandsJSON(guildID, commadsJSON);
}


module.exports = {
	addGuildCommandPermissionsRole,
	updateGuildCommandsPermissionsRole,
	removeGuildCommandPermissionRole,
	checkAndUpdateGuildsCommands,
	deleteAllGuildCommands,
	addGuildCommands,
};