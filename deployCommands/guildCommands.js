const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const dotenv = require('dotenv');


dotenv.config();
const rest = new REST({ version: process.env.DISCORD_API_VERSION.toString() })
	.setToken(process.env.DISCORD_TOKEN);

// GET
/**
 * @param {string} guildID
 */
async function getGuildCommands(guildID) {
	return await rest.get(
		Routes.applicationGuildCommands(process.env.APP_ID, guildID),
	).catch(console.error);
}

/**
 * @param {string} guildID
 * @returns {Array}
 */
async function getGuildAllCommandsPermissions(guildID) {
	const commands = await rest.get(
		Routes.guildApplicationCommandsPermissions(process.env.APP_ID, guildID),
	);
	return commands;
}


/**
 * @param {string} guildID
 * @param {string} commandID
 * @returns {Array}
 */
async function getGuildCommandPermissions(guildID, commandID) {
	try {
		const command = await rest.get(
			Routes.applicationCommandPermissions(process.env.APP_ID, guildID, commandID),
		);
		return command.permissions;
	}
	catch (e) {
		return [];
	}
}


// PUT
/**
 * @param {string} guildID
 * @param {string} commandID
 * @param {string} roleID
 */
async function removeRoleGuildCommandPermission(guildID, commandID, RoleID) {
	const commandPermissions = await getGuildCommandPermissions(guildID, commandID);
	const finalPermissions = commandPermissions.filter(
		(currentValue) => (currentValue.id !== RoleID),
	);

	// Set new Permissions List
	return await setGuildCommandPermissions(guildID, commandID, finalPermissions);
}

/**
 * @param {string} guildID
 * @param {string} commandID
 * @param {Array} permissionsList
 */
async function setGuildCommandPermissions(guildID, commandID, permissionsList) {
	return await rest.put(
		Routes.applicationCommandPermissions(process.env.APP_ID, guildID, commandID),
		{
			body: {
				'permissions': permissionsList,
			},
		}).catch(console.error);
}

/**
 * @param {string} guildID
 * @param {string} commandID
 * @param {string} roleID
 */
async function addRoleGuildCommandPermissions(guildID, commandID, roleID) {
	const commandPermissions = await getGuildCommandPermissions(guildID, commandID);
	// Insert role in Command Permissions
	commandPermissions.push({ id: roleID, type: 1, permission: true });
	await setGuildCommandPermissions(guildID, commandID, commandPermissions);
}


/**
 * @param {String} guildID
 * @param {JSON} commadsJSON
 */
async function addGuildCommandsJSON(guildID, commadsJSON) {
	await rest.put(
		Routes.applicationGuildCommands(process.env.APP_ID, guildID),
		{ body: commadsJSON },
	).catch(console.error);
}

async function deleteGuildCommand(guildID, commandID) {
	return await rest.delete(
		Routes.applicationGuildCommand(process.env.APP_ID, guildID, commandID),
	).catch(console.error);
}


module.exports = {
	getGuildCommands,
	removeRoleGuildCommandPermission,
	getGuildAllCommandsPermissions,
	getGuildCommandPermissions,
	addGuildCommandsJSON,
	deleteGuildCommand,
	addRoleGuildCommandPermissions,
};
