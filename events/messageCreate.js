const i18n = require('i18n');
const { deleteMessage } = require('../utils/message-utils');
const { getGuildPrefix } = require('../utils/prefix-utils');
const { checkUserHasPermissions } = require('../utils/permissions');

module.exports = async (client, message) => {
    if (message.author.bot || !message.guild) return;

    // Get prefix in DB
    const guildPrefix = await getGuildPrefix(message);

    // Does not contain the prefix.
    if (message.content.slice(0, guildPrefix.length) !== guildPrefix) {
        return;
    }

    const args = message.content.includes(guildPrefix)
        ? message.content.slice(guildPrefix.length).trim().split(/ +/)
        : message.content.trim().split(/ +/);

    const commandName = message.content.includes(guildPrefix)
        ? args.shift().toLowerCase()
        : args[0].toLowerCase();

    if (!commandName) return; // Empty CommandName

    // Search Command by name, aliases
    let command =
        client.commands.get(commandName) ||
        client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName)) ||
        false;

    // Command Error msg
    if (!command) {
        message.channel
            .send({
                embeds: [
                    {
                        title: i18n.__('commandErrors.commandNotFound.title'),
                        description: i18n
                            .__('commandErrors.commandNotFound.description')
                            .join('\n'),
                        color: '#F0463A',
                    },
                ],
            })
            .then((msg) => {
                deleteMessage(msg); // Delete Bot message
            })
            .catch(console.error);
        deleteMessage(message); // Delete User command message
        return false;
    }

    // Execute Command
    try {
        // Check Command Permissions
        const userHasPerm = checkUserHasPermissions(command.permissions, message);
        if (!userHasPerm) {
            return message
                .reply(i18n.__('commandErrors.userWithoutPermission'))
                .then((msg) => {
                    deleteMessage(msg); // Delete Bot message
                })
                .catch(console.error);
        }

        command.execute(message, args, client).then((msg) => {
            deleteMessage(msg); // Delete Bot message
        });
    } catch (error) {
        console.error(error);
        message.reply(i18n.__('commandErrors.ExecutionError')).catch(console.error);
        return false;
    }

    deleteMessage(message); // Delete User command message
};
