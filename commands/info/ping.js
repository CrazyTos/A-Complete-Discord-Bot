const i18n = require('i18n');
const CommandFinal = require('../../utils/CommandFinal');

module.exports = class PingCommand extends CommandFinal {
    constructor(client) {
        super(client, {
            name: 'ping',
            aliases: ['sap'],
            group: 'info',
            memberName: 'ping',
            description: 'Get the latency of the bot.',
            guildOnly: true,
            clientPermissions: ['ADMINISTRATOR', 'MANAGE_MESSAGES'],
            userPermissions: ['MANAGE_MESSAGES'],
            throttling: {
                usages: 1,
                duration: 20,
            },
        });
    }

    async run(message) {
        message.say({
            content: '',
            embed: {
                description: [
                    `${i18n.__('ping.latency')} **${Date.now() - message.createdTimestamp}${i18n.__('ping.ms')}**`,
                    `${i18n.__('ping.apiLatency')} **${Math.round(message.client.ws.ping)}${i18n.__('ping.ms')}**`,
                ].join('\n'),
                color: '#C14BF7',
            },
        });
    }
};
