module.exports = {
    async run(client, message) {
        if (message.author.bot) return;
        if (!message.content.toLowerCase().startsWith('stp')) return;
        const args = message.content.split(" ");
        args.shift();
        const commandName = args.shift().toLowerCase();
        const command = client.prefix_commands.get(commandName);

        if (!command) return await message.reply(`Unknown command: \`${commandName}\``);
        if (command.permissions && command.permissions.length > 0) {
            const hasPermission = command.permissions.some((perm) => message.member.roles.cache.has(perm));
            if (!hasPermission) {
                return await message.reply("You don't have permission to use this command.");
            }
        }

        try {
            await command.execute(client, message, args);
        } catch (error) {
            console.error(error);
            await message.reply('There was an error executing this command.');
        }
    }
}