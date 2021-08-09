const i18n = require('i18n');
const { Message, MessageActionRow, MessageButton, Interaction } = require('discord.js');
const prefixModel = require('../../models/prefixModel');
const { collectorResetPrefix } = require('../../collectors/buttons/prefix');
const { getGuildPrefix } = require('../../utils/prefix-utils');
const { deleteMessage } = require('../../utils/message-utils');

module.exports = {
    name: 'prefix',
    aliases: [],
    arguments: ['<new prefix>', 'reset'],
    description: 'Replies with Pong!',
    permissions: ['MANAGE_GUILD'],
    /**
     *
     * @param {Message} message
     * @param {String[]} args
     * @returns
     */
    async execute(message, args) {
        if (!args.length)
            return message.channel.send(
                i18n.__('commands.prefix.current', { prefix: await getGuildPrefix(message) })
            );

        const newPrefix = args
            .join('')
            .toLowerCase()
            .replace(/([\$\%\/\*\(\)\&\¨\@\"\{\}\[\]\´\`\^'])/g, '');

        if (args[0] === 'reset') {
            const row = new MessageActionRow().addComponents(
                new MessageButton()
                    .setCustomId('cprefix-confirm')
                    .setLabel(i18n.__('buttons.text.yes'))
                    .setStyle('SUCCESS'),
                new MessageButton()
                    .setCustomId('cprefix-cancel')
                    .setLabel(i18n.__('buttons.text.cancel'))
                    .setStyle('DANGER')
            );
            const msg = await message.channel.send({
                content: i18n.__('commands.prefix.reset.question', { prefix: process.env.PREFIX }),
                components: [row],
            });

            // Receiving buttons & Responding
            collectorResetPrefix(msg, message.author.id);
            return;
        }

        prefixModel.findOne({ Guild: message.guild.id }, async (err, data) => {
            if (err) {
                console.log(err);
                return message.channel.send(i18n.__('commands.prefix.error'));
            }

            // Create data in DB
            if (!data) {
                data = new prefixModel({
                    Guild: message.guild.id,
                    Prefix: newPrefix,
                });
                data.save();
                const msg = await message.channel.send(
                    i18n.__('commands.prefix.new', { prefix: newPrefix })
                );
                deleteMessage(msg); // Delete Bot message
                return;
            }

            // Update data in DB
            data = await prefixModel.findOneAndUpdate(
                { Guild: message.guild.id },
                { Prefix: newPrefix }
            );
            data.save();
            const msg = await message.channel.send(
                i18n.__('commands.prefix.error', { prefix: newPrefix })
            );
            deleteMessage(msg); // Delete Bot message
        });
    },
};
