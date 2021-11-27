module.exports = {
	name: 'interactionCreate',
	once: false,
	async execute(interaction) {
		if (!interaction.isSelectMenu()) return;

		const componentData = interaction.customId.split('_');
		const command = interaction.client.commands.get(componentData[0]);
		if (!command) {return;}

		await interaction.deferReply({ ephemeral: true });

		try {
			await command.responseComponents(interaction);
		}
		catch (error) {
			console.error(error);
			await interaction.editReply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	},
};