const i18n = require('i18n');
const { deleteMessage } = require('../../utils/message-utils');
const prefixModel = require('../../models/prefixModel');

function collectorResetPrefix(message, authorId) {
    const filter = (i) => i.user.id === authorId;

    const collector = message.channel.createMessageComponentCollector({
        filter,
        max: 1,
        time: 15000,
    });

    collector.on('collect', async (i) => {
        if (i.customId === 'cprefix-cancel') {
            await i.update({ content: i18n.__('commands.prefix.reset.cancel'), components: [] });
        } else if (i.customId === 'cprefix-confirm') {
            await prefixModel.findOneAndDelete({ Guild: message.guild.id });
            await i.update({
                content: i18n.__('commands.prefix.reset.confirm', { prefix: process.env.PREFIX }),
                components: [],
            });
        }
    });

    collector.on('end', (collected) => {
        deleteMessage(message);
    });
}
module.exports = {
    collectorResetPrefix,
};
