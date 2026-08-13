const { EmbedBuilder } = require('discord.js');
const ms = require('ms');
const fs = require('node:fs');
const path = require('node:path');

module.exports = {
    name: 'help',
    description: 'Shows all The Stopover bot\'s commands',
    category: 'utility',
    usage: '`stp help [command]`',
    cooldown: 1000 * 10,
    testing: false,
    alias: ['command', 'commands'],
    permissions: [],
    async execute(client, message, args) {
        const embed = new EmbedBuilder()
            .setColor(0xffa0fb)
            .setFooter({ text: "the stopover bot by ashiii ♡" })
            .setThumbnail(message.guild.iconURL())

        let content = "";
        if (!args[0]) {
            let profileCommands = [];
            let utilityCommands = [];
            let economyCommands = [];
            let rpgCommands = [];
            let actionCommands = [];

            for (command of client.prefix_commands) {
                if (!command[1].testing && command[1].category != 'admin') {
                    let commandWrapped = `\`${command[0]}\``
                    if (command[1].category == 'profile') profileCommands.push(commandWrapped);
                    if (command[1].category == 'economy') economyCommands.push(commandWrapped);
                    if (command[1].category == 'rpg') rpgCommands.push(commandWrapped);
                    if (command[1].category == 'action') actionCommands.push(commandWrapped);
                    if (command[1].category == 'utility') utilityCommands.push(commandWrapped);
                }
            }

            content += `# \`STOPOVER BOT COMMANDS\`\n> Use \`stp help <command>\` for more information`;
            content += `\n### 👤 Profile Commands\n${profileCommands.join(', ')}`;
            content += `\n### <a:heartgem:1534217106252628038> Economy Commands\n${economyCommands.join(', ')}`;
            content += `\n### 🗡️ RPG Commands\n${rpgCommands.join(', ')}`;
            content += `\n### 👋🏻 Action Commands\n${actionCommands.join(', ')}`;
            content += `\n### ⚙️ Utility Commands\n${utilityCommands.join(', ')}`;
        } else {
            content += `-# Command Information\n`
            const commandName = args[0];
            const command = client.prefix_commands.get(commandName) || client.prefix_commands.find(cmd => cmd.alias && cmd.alias.includes(commandName));
            if (!command || command.testing) return await message.reply(`Command not found! Use \`stp help\` for a list of commands`);

            content += `# \`${command.name.toUpperCase()}\`\n> ${command.description}\n🔹 **Category**: ${command.category}\n🔹 **Usage**: \`${command.usage}\``;
            if (command.alias && command.alias.length > 0) content += `\n🔹 **Aliases**: ${command.alias.join(', ')}`;
            if (command.permissions && command.permissions.length > 0) {
                content += `\n🔹 **Required Roles**: `
                for (role of command.permissions) {
                    content += `<@&${role}> `
                }
            }
            if (command.cooldown) content += `\n🔹 **Cooldown**: ${ms(command.cooldown, { long: true })}`;
        };

        embed.setDescription(content);
        await message.reply({ embeds: [embed] });
    }
}