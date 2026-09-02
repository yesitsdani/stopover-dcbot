const ms = require("ms");
const { getUser, getRpgUser, getMemberName, iconizeTitle } = require("../modules");
const User = require("../models/User");
const { getMailedUser, removeMailedUser, getAfkUser, removeAfkUser } = require("../alerts");

module.exports = {
    async run(client, message, prefix) {
        if (message.author.bot) return;
        if (prefix == "atc" && !(message.author.id == "811596799663800341" || message.author.id == "877167420572319804")) return;

        const uid = message.author.id;
        const gid = message.guild.id;
        if (getMailedUser(uid)) {
            await message.reply(`You have unread mail! Go to <#1543300726812319845>`);
            await removeMailedUser(gid, uid);
        }

        if (getAfkUser(uid)) {
            const member = message.member;
            let nickname = getMemberName(member);
            if (nickname.startsWith('{afk} ')) {
                nicknameArray = nickname.split(" ")
                nicknameArray.shift()
                nickname = nicknameArray.join(" ");
                try { await member.setNickname(nickname); }
                catch (e) { }
            }
            await message.reply(`\`AFK REMOVED\`: Hello hi mabuhay, Passerby! Welcome back!`);
            await removeAfkUser(gid, uid);
        }

        for (const user of message.mentions.users.values()) {
            const afk = getAfkUser(user.id);
            if (!afk) continue;
            const member = await message.guild.members.fetch(afk.uid);
            const userData = await getUser(afk.uid);
            let nickname = getMemberName(member);
            if (nickname.startsWith('{afk} ')) {
                nicknameArray = nickname.split(" ")
                nicknameArray.shift()
                nickname = nicknameArray.join(" ");
            }

            let since = `since ${ms(Date.now() - parseInt(afk.afkSince), { long: true })} ago`;

            let title = iconizeTitle(userData.title);
            if (member.roles.cache.has('1528808520718356490')) title = '<:stp_pinkbow:1534224205992955956> **\`FIRST LADY\`**';
            if (member.roles.cache.has('1511897066262237285')) title = '<:council:1534102603040821308> **\`COUNCIL MEMBER\`**';
            if (member.roles.cache.has('1506448680000159784')) title = '<:gavel:1534097246675796009> **\`THE CHIEF PASSERBY\`**';

            if (afk.reason.length > 0) {
                await message.reply(`${title}, **${nickname}**, is AFK ${since}: ${afk.reason}`);
            } else {
                await message.reply(`${title}, **${nickname}**, is AFK ${since}`);
            }
        }

        if (!message.content.toLowerCase().startsWith(prefix)) return;

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
                if ((Date.now() + 1000) < commandCD.date) return await message.reply(`You can use this command again in \`${ms(parseInt(commandCD.date) - Date.now(), { long: true })}\``)
            }
        }

        const rpgData = await getRpgUser(message.author.id);
        if (
            rpgData.dead &&
            command.name != "revive" &&
            !command.bypassDeath
        ) return await message.reply(`You are currently dead. Please do \`stp revive\``)

        try {
            if (command.cooldown && message.author.id != '877167420572319804') {
                let newCDs = CDs.filter(obj => obj.cmd != command.name);
                newCDs.push({ cmd: command.name, date: Date.now() + command.cooldown });
                await User.findOneAndUpdate(
                    { uid },
                    { cooldowns: newCDs }
                )
            }
            await command.execute(client, message, args);
        } catch (error) {
            console.error(error);
            await message.reply('Ashi made an oopsie... let him know na lang!!');
        }
    }
}