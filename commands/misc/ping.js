const { SlashCommandBuilder } = require('@discordjs/builders');
const { __ } = require('../../utils/languages-utils');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	globalCommand: false,
	userPermissions: [],
	async execute(interaction) {
		const guildID = interaction.guildId;
		const pingingMessage = await interaction.reply({
			content: __(guildID, 'commands.ping.pinging'),
			fetchReply: true,
		});

		const apiPing = interaction.client.ws.ping;
		const serverPing = pingingMessage.createdTimestamp - interaction.createdTimestamp;

		interaction.editReply(__(
			guildID, 'commands.ping.message', { server: serverPing, api: apiPing }));
	},
};