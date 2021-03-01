const i18n = require('i18n');
const CommandFinal = require('../../utils/CommandFinal');

module.exports = class PingCommand extends CommandFinal {
    constructor(client) {
        super(client, {
            name: 'ping',
            group: 'info',
            memberName: 'ping',
            description: 'Get the latency of the bot.',
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 20,
            },
        });
    }

    run(msg) {
        msg.say({
            content: '',
            embed: {
                description: [
                    `${i18n.__('ping.latency')} **${Date.now() - msg.createdTimestamp}${i18n.__('ping.ms')}**`,
                    `${i18n.__('ping.apiLatency')} **${Math.round(msg.client.ws.ping)}${i18n.__('ping.ms')}**`,
                ].join('\n'),
                color: '#C14BF7',
            },
        });
    }
};
