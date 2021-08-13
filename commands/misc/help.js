const { Client, CommandInteraction } = require('discord.js');
const { allCommands } = require('../../utils/allCommands');
const i18n = require('i18n');
const fs = require('fs');

module.exports = {
    name: 'help',
    description: i18n.__('commands.help.description'),
    options: [
        {
            name: 'command_name',
            description: i18n.__('commands.help.options.commandName'),
            type: 'STRING',
            require: false,
            choices: allCommandsForChoices(),
        },
    ],
    permissions: [],
    argsForHelp: {},
    /**
     *
     * @param {CommandInteraction} interaction
     * @param {Client} client
     * @returns
     */
    async execute(interaction, client) {
        const specificCommand = interaction.options.getString('command_name');

        // All Commands
        if (!specificCommand) {
            const commands = {};

            allCommands().forEach((cmd) => {
                // Create group
                if (!(cmd.group in commands)) {
                    const groupName = cmd.group.charAt(0).toUpperCase() + cmd.group.slice(1);
                    commands[cmd.group] = { name: groupName, value: '', inline: true };
                }
                // Add command in group
                commands[cmd.group].value += '``' + cmd.name + '``\n';
            });

            const embed = {
                title: i18n.__('commands.help.embed.title'),
                color: '#C14BF7',
                fields: Object.entries(commands).map(([key, value]) => value),
            };

            return interaction.followUp({ embeds: [embed] });
        }

        // Specific command
        const command = allCommands().get(specificCommand);

        if (!command) {
            return interaction.followUp(i18n.__('commands.help.errors.commandNotFound'));
        }

        let commandArgs = Object.entries(command.argsForHelp).map(
            (cmdArgs) => '`` /' + command.name + ' ' + cmdArgs[0] + ' `` - ' + cmdArgs[1]
        );

        commandArgs = commandArgs.length
            ? commandArgs.join('\n')
            : i18n.__('commands.help.specificCommand.commandArgs.notFound', {
                  commandName: command.name,
              });

        const embed = {
            title: command.name.charAt(0).toUpperCase() + command.name.slice(1),
            description: command.description + '\n\u200B',
            color: '#C14BF7',
            fields: [{ name: i18n.__('commands.help.embed.fields.options'), value: commandArgs }],
        };

        return interaction.followUp({ embeds: [embed] });
    },
};

function allCommandsForChoices() {
    const commands = [];
    fs.readdirSync('./commands')
        .filter(
            (dir) =>
                fs.existsSync(`./commands/${dir}`) &&
                fs.lstatSync(`./commands/${dir}`).isDirectory()
        )
        .forEach((commandSubFolder) => {
            fs.readdirSync(`./commands/${commandSubFolder}`)
                .filter((file) => file.endsWith('.js'))
                .forEach((cmdFileName) => {
                    commands.push({
                        name: cmdFileName.substring(0, cmdFileName.length - 3),
                        value: cmdFileName.substring(0, cmdFileName.length - 3),
                    });
                });
        });
    return commands;
}
