/* eslint-disable no-useless-constructor */
/**
 * This class only overlaps the "onBlock" function of the Command class,
 * just for the purpose of translating messages.
 * Currently there is a fork of this package that contains a system for translation.
 * Currently does not have documentation, so if you want to use the mentioned fork, Good Luck
 * Fork: https://github.com/respawn-network/Commando/
 */
const i18n = require('i18n');
const { Command } = require('discord.js-commando');

module.exports = class CommandFinal extends Command {
    constructor(client, info) {
        super(client, info);
    }

    onBlock(message, reason, data) {
        switch (reason) {
        case 'guildOnly':
            return message.reply(i18n.__('discordjsCommando.onBlock.guildOnly', this.name));
        case 'nsfw':
            return message.reply(i18n.__('discordjsCommando.onBlock.nsfw', this.name));
        case 'permission': {
            if (data.response) return message.reply(data.response);
            return message.reply(i18n.__('discordjsCommando.onBlock.permission', this.name));
        }
        case 'clientPermissions': {
            if (data.missing.length === 1) {
                return message.reply(i18n.__('discordjsCommando.onBlock.clientPermissions.one',
                    { permission: data.missing[0], name: this.name }));
            }
            return message.reply(i18n.__('discordjsCommando.onBlock.clientPermissions.more',
                { name: this.name, permissions: data.missing.map((perm) => perm).join(', ') }));
        }
        case 'throttling': {
            return message.reply(i18n.__('discordjsCommando.onBlock.throttling',
                { name: this.name, seconds: data.remaining.toFixed(1) }));
        }
        default:
            return null;
        }
    }
};
