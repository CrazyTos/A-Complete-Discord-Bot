const fs = require('fs');
const { Collection } = require('discord.js');

const allcmds = new Collection();

module.exports = {
    allCommands: () => {
        if (allcmds.size) return allcmds;

        fs.readdirSync('./commands')
            .filter(
                (dir) =>
                    fs.existsSync(`./commands/${dir}`) &&
                    fs.lstatSync(`./commands/${dir}`).isDirectory()
            )
            .forEach((commandSubFolder) => {
                fs.readdirSync(`./commands/${commandSubFolder}`)
                    .filter((file) => file.endsWith('.js'))
                    .forEach((commandFile) => {
                        const command = require(`../commands/${commandSubFolder}/${commandFile}`);
                        command.group = commandSubFolder.toLowerCase();
                        console.log(`[Commands] Loaded: ${command.name}`);
                        allcmds.set(command.name, command);
                    });
            });
        return allcmds;
    },
};
