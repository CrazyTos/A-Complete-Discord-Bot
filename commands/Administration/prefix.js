const i18n = require('i18n');
const CommandFinal = require('../../utils/CommandFinal');

module.exports = class xPrefixCommand extends CommandFinal {
    constructor(client) {
        super(client, {
            name: 'x',
            group: 'administration',
            memberName: 'x',
            description: 'Shows or sets the command prefix.',
            examples: ['prefix', 'prefix -', 'prefix omg!'],
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 20,
            },
            args: [
                {
                    key: 'prefix',
                    type: 'string',
                    prompt: 'What would you like to set the bot\'s prefix to?',
                    max: 10,
                    default: '',
                },
            ],
        });
    }

    async run(msg, args) {
        // Shows the current Prefix
        if (!args.prefix) {
            const prefix = msg.guild ? msg.guild.commandPrefix : this.client.commandPrefix;
            const prefixMessage = prefix ? i18n.__('prefix.currentPrefix', prefix) : i18n.__('prefix.currentPrefixNone');
            return msg.reply(prefixMessage + i18n.__('utils.runCommandUse', msg.anyUsage('command')));
        }

        // Checks user permissions
        if (!msg.member.hasPermission('ADMINISTRATOR')) {
            return msg.reply(i18n.__('prefix.permissions.noADMINISTRATOR'));
        }

        // Update Guild Prefix
        const prefix = args.prefix.toLowerCase();
        let response;
        if (prefix === 'default') {
            if (msg.guild) msg.guild.commandPrefix = null; else this.client.commandPrefix = null;
            const defaultPrefix = this.client.commandPrefix ? this.client.commandPrefix : i18n.__('prefix.setPrefix.noPrefix');
            response = i18n.__('prefix.resetPrefix', defaultPrefix);
        } else {
            if (msg.guild) msg.guild.commandPrefix = prefix; else this.client.commandPrefix = prefix;
            response = prefix !== 'none' ? i18n.__('prefix.setPrefix.newPrefix', args.prefix) : i18n.__('prefix.removedPrefix');
        }

        await msg.reply(`${response}\n${i18n.__('utils.runCommandUse', msg.anyUsage('command'))}`);
        return null;
    }
};
