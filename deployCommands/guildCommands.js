const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const rest = new REST({ version: process.env.DISCORD_API_VERSION.toString() })
	.setToken(process.env.DISCORD_TOKEN);


// GET

/**
 * @param {String} guildID
 */
async function getGuildCommands(guildID) {
	return await rest.get(
		Routes.applicationGuildCommands(process.env.APP_ID, guildID),
	).catch(console.error);
}

/**
 * @param {String} guildID
 * @returns {Array}
 */
async function getGuildCommandsPermissions(guildID) {
	const commands = await rest.get(
		Routes.guildApplicationCommandsPermissions(process.env.APP_ID, guildID),
	);
	return commands;
}

/**
 * @param {String} guildID
 * @param {String} commandID
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
 * @param {String} guildID
 * @param {String} commandID
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
 * @param {String} guildID
 * @param {JSON} commadsJSON
 */
async function addGuildCommandsJSON(guildID, commadsJSON) {
	await rest.put(
		Routes.applicationGuildCommands(process.env.APP_ID, guildID),
		{ body: commadsJSON },
	).catch(console.error);
}

/**
 * @param {String} guildID
 * @param {String} commandID
 */
async function deleteGuildCommand(guildID, commandID) {
	return await rest.delete(
		Routes.applicationGuildCommand(process.env.APP_ID, guildID, commandID),
	).catch(console.error);
}


module.exports = {
	getGuildCommands,
	getGuildCommandsPermissions,
	getGuildCommandPermissions,
	setGuildCommandPermissions,
	addGuildCommandsJSON,
	deleteGuildCommand,
};
