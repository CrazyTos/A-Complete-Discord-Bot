const prefixModel = require('../models/prefixModel');

async function getGuildPrefix(message) {
    let custom;
    const data = await prefixModel
        .findOne({
            Guild: message.guild.id,
        })
        .catch((err) => console.log(err));
    if (data) {
        custom = data.Prefix;
    } else {
        custom = process.env.PREFIX;
    }
    return custom;
}

module.exports = {
    getGuildPrefix,
};
