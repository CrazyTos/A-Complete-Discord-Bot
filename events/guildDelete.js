module.exports = {
	name: 'guildDelete',
	once: false,
	async execute(guild) {
		console.log('[GUILD] Left guild: ' + guild.name);
	},
};
