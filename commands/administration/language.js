const { MessageActionRow, MessageSelectMenu } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { connectDB } = require('../../database/mongoose-connect');
const { __, updateLanguageCache } = require('../../utils/languages-utils');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('language')
		.setDescription('Language Command.')
		.setDefaultPermission(false),
	globalCommand: false,
	userPermissions: ['ADMINISTRATOR'],
	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });
		const languageSelect = new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
					.setCustomId('language')
					.setPlaceholder(__(interaction.guildId, 'commands.language.selectLanguage'))
					.addOptions(languagesOptionsList(interaction.client.languagesList)),
			);

		await interaction.editReply({
			content: __(interaction.guildId, 'commands.language.currentDefault', { current: '--' }),
			components: [languageSelect],
		});
	},
	async responseComponents(interaction) {
		const guildID = interaction.guildId;
		const languageVal = interaction.values[0].toLowerCase();
		if (!languageVal) { return; }
		if (!interaction.client.languagesList.includes(languageVal)) {
			return await interaction.editReply(__(guildID, 'commands.language.notSupported'));
		}

		await interaction.editReply(__(guildID, 'commands.language.updating'));

		// Update local cache Language
		updateLanguageCache(guildID, languageVal);

		// Update guild language in db
		await connectDB().then(async (mongoose) => {
			try {
				await interaction.client.database.updateLanguage(
					interaction.guild.id, interaction.values[0],
				);

				interaction.editReply({
					content: __(guildID, 'commands.language.updated'),
				});
			}
			finally {
				mongoose.connection.close();
			}
		});

	},
};


function languagesOptionsList(languagesList) {
	const languagesOptions = [];
	for (const language of languagesList) {
		languagesOptions.push({
			label: language.toUpperCase(),
			value: language,
		});
	}
	return languagesOptions;
}

