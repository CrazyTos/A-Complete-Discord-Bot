const i18n = require('i18n');

module.exports = (client, message) => {
    if (message.author.bot || message.channel.type === 'dm') return;
};
