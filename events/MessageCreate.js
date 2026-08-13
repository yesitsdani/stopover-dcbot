const ms = require("ms");
const { getUser } = require("../modules");
const User = require("../models/User");

module.exports = {
    async run(client, message, prefix) {
        if (message.author.bot) return;
        if (!message.content.toLowerCase().startsWith(prefix)) return;
        if (prefix == "atc" && !(message.author.id == "811596799663800341" || message.author.id == "877167420572319804")) return;
        const args = message.content.split(" ");
        args.shift();
        if (args.length < 1) return;
        const commandName = args.shift().toLowerCase();
        const command = client.prefix_commands.get(commandName) || client.prefix_commands.find(cmd => cmd.alias && cmd.alias.includes(commandName));

        if (!command) return await message.reply(`Unknown command: \`${commandName}\``);
        if (command.permissions && command.permissions.length > 0) {
            const hasPermission = command.permissions.some((perm) => message.member.roles.cache.has(perm));
            if (!hasPermission) {
                return await message.reply("You don't have permission to use this command.");
            }
        }

        let CDs;
        if (command.cooldown) {
            const user = await getUser(message.author.id);
            CDs = user.cooldowns;
            let commandCD = user.cooldowns.find(obj => obj.cmd == command.name);
            if (commandCD && message.author.id != '877167420572319804') {
                if (Date.now() < commandCD.date) return await message.reply(`You can use this command again in \`${ms(parseInt(commandCD.date) - Date.now(), { long: true })}\``)
            }
        }

        try {
            await command.execute(client, message, args);
            if (command.cooldown && message.author.id != '877167420572319804') {
                let newCDs = CDs.filter(obj => obj.cmd != command.name);
                newCDs.push({ cmd: command.name, date: Date.now() + command.cooldown });
                await User.findOneAndUpdate(
                    { uid: message.author.id },
                    { cooldowns: newCDs }
                )
            }
        } catch (error) {
            console.error(error);
            await message.reply('Ashi made an oopsie... let him know na lang!!');
        }
    }
}