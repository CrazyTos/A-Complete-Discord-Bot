const i18n = require('i18n');
const { checkUserHasPermissions } = require('../utils/permissions');
const { deleteMessage } = require('../utils/message-utils');
const { allCommands } = require('../utils/allCommands');

module.exports = async (client, interaction) => {
    if (!interaction.isCommand()) return console.log('nao é comand');

    await interaction.deferReply({ ephemeral: false }).catch(console.error);

    const command = allCommands().get(interaction.commandName);

    if (!command) {
        return interaction.followUp({ content: 'This command no longer exist.' });
    }

    // Execute Command
    try {
        // Check Command Permissions
        const userHasPerm = checkUserHasPermissions(command.permissions, interaction);
        if (!userHasPerm) {
            return interaction
                .followUp(i18n.__('commandErrors.userWithoutPermission'))
                .then((msg) => {
                    deleteMessage(msg); // Delete Bot message
                })
                .catch(console.error);
        }

        command.execute(interaction, client).then((msg) => {
            deleteMessage(msg, 15000); // Delete Bot message
        });
    } catch (error) {
        console.error(error);
        message.reply(i18n.__('commandErrors.ExecutionError')).catch(console.error);
    }
};
