const { Client, Message } = require('discord.js');

module.exports = {
    name: 'help',
    aliases: [],
    arguments: { '<command name>': 'Show info about a specific command' },
    description: 'List all of my commands or info about a specific command.',
    permissions: [],
    /**
     *
     * @param {Message} message
     * @param {String[]} args
     * @param {Client} client
     * @returns
     */
    async execute(message, args, client) {
        // All Commands
        if (!args.length) {
            const commands = {};
            client.commands.forEach((cmd) => {
                // Create group
                if (!(cmd.group in commands)) {
                    const groupName = cmd.group.charAt(0).toUpperCase() + cmd.group.slice(1);
                    commands[cmd.group] = { name: groupName, value: '', inline: true };
                }
                // Add command in group
                commands[cmd.group].value += '``' + cmd.name + '``\n';
            });

            const embed = {
                title: '--= Help =--',
                color: '#C14BF7',
                fields: Object.entries(commands).map(([key, value]) => value),
            };

            return message.channel.send({ embeds: [embed] });
        }

        // Specific command
        const command = client.commands.get(args[0]);

        if (!command) {
            return message.channel.send('Command Not found.');
        }

        let commandArgs = Object.entries(command.arguments).map(
            (cmdArgs) =>
                '`` ' + client.guildPrefix + command.name + ' ' + cmdArgs[0] + ' `` - ' + cmdArgs[1]
        );
        commandArgs = commandArgs.length
            ? commandArgs.join('\n')
            : 'This command has no **Options**.\n Just use `` ' +
              client.guildPrefix +
              command.name +
              ' ``\u200B';

        const commandAliases = command.aliases.length
            ? command.aliases.join(' | ')
            : 'This command has no **Aliases**.\n\u200B';

        const embed = {
            title: command.name.charAt(0).toUpperCase() + command.name.slice(1),
            description: command.description + '\n\u200B',
            color: '#C14BF7',
            fields: [
                { name: 'Aliases', value: commandAliases },
                { name: 'Options', value: commandArgs },
            ],
        };

        return message.channel.send({ embeds: [embed] });
    },
};
