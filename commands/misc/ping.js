const i18n = require('i18n');
const { Client, CommandInteraction } = require('discord.js');

module.exports = {
    name: 'ping',
    options: [],
    description: i18n.__('commands.ping.description'),
    permissions: [],
    argsForHelp: {
        '': i18n.__('commands.ping.args.showPing'),
    },
    /**
     *
     * @param {CommandInteraction} interaction
     * @param {Client} client
     * @returns
     */
    async execute(interaction, client) {
        interaction.followUp;
        return interaction.followUp({
            content: '. :ping_pong:',
            embeds: [
                {
                    // description: `**${msg.createdAt - message.createdAt}ms**`,
                    description: '**' + client.ws.ping + ' ms**',
                    color: '#C14BF7',
                },
            ],
        });
    },
};
