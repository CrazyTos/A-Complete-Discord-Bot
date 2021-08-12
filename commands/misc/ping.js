const { Client, Message } = require('discord.js');

module.exports = {
    name: 'ping',
    aliases: [],
    arguments: {
        '': i18n.__('commands.ping.args.showPing'),
    },
    description: i18n.__('commands.ping.description'),
    permissions: [],
    /**
     *
     * @param {Message} message
     * @param {String[]} args
     * @param {Client} client
     * @returns
     */
    async execute(message, args, client) {
        return message.channel.send('Pinging...').then((msg) => {
            return msg.edit({
                content: ':ping_pong:',
                embeds: [
                    {
                        // description: `**${msg.createdAt - message.createdAt}ms**`,
                        description: '**' + Math.round(client.ws.ping) + ' ms**',
                        color: '#C14BF7',
                    },
                ],
            });
        });
    },
};
