const { Message, Interaction } = require('discord.js');
const { deleteMessage } = require('../utils/message-utils');

/**
 *
 * @param {Object.<string, function(Interaction)>} customIds
 * @param {Message} message
 * @param {String} authorId
 */
function buttonCollector(customIds, message, authorId) {
    const filter = (i) => i.user.id === authorId;

    const collector = message.channel.createMessageComponentCollector({
        filter,
        max: 1,
        time: 15000,
    });

    collector.on('collect', async (interaction) => {
        Object.keys(customIds).forEach(async (key, index) => {
            if (i.customId === key) {
                await customIds[key](interaction);
            }
        }, customIds);
    });

    collector.on('end', (collected) => {
        deleteMessage(message);
    });
}
module.exports = {
    buttonCollector,
};
