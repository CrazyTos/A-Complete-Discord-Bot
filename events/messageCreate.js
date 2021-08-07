const i18n = require('i18n');
const { deleteMessage } = require('../utils/message-utils');

module.exports = async (client, message) => {
    if (message.author.bot || !message.guild) return;

    // Sets the guild.prefix
    message.guild.prefix = process.env.PREFIX;

    // Does not contain the prefix.
    if (message.content.slice(0, message.guild.prefix.length) !== message.guild.prefix) {
        return;
    }

    const args = message.content.includes(message.guild.prefix)
        ? message.content.slice(message.guild.prefix.length).trim().split(/ +/)
        : message.content.trim().split(/ +/);

    const commandName = message.content.includes(message.guild.prefix)
        ? args.shift().toLowerCase()
        : args[0].toLowerCase();

    // Empty CommandName
    if (!commandName) {
        return;
    }

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
                // Delete Bot message
                deleteMessage(msg);
            })
            .catch(console.error);
        // Delete User command message
        deleteMessage(message);
        return false;
    }

    // Execute Command
    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply(i18n.__('commandErrors.ExecutionError')).catch(console.error);
        return false;
    }

    // Delete User command message
    deleteMessage(message);
};
