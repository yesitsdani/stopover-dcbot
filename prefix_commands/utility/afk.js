const { newAfkUser } = require("../../alerts");
const { getMemberName } = require("../../modules");

module.exports = {
    name: 'afk',
    description: 'Sets Passerby afk',
    category: 'utility',
    usage: '`stp afk [reason]`',
    cooldown: 1000 * 10,
    testing: false,
    alias: [],
    permissions: [],
    async execute(client, message, args) {
        let reason = "";
        if (args[0]) reason = args.join(" ");
        if (reason.length > 250) return message.reply(`You can only set an AFK reason for up to \`250\` characters max`);

        const member = message.member;
        const uid = message.author.id;
        let nickname = getMemberName(member);
        if ((nickname.length + 6) <= 31) nickname = `{afk} ${nickname}`;

        try { await member.setNickname(nickname); }
        catch (e) { }

        const afkSince = Date.now();
        
        await newAfkUser(message.guild.id, {
            uid,
            reason,
            afkSince
        });

        if (reason.length > 0) return await message.reply(`**\`Passerby AFK Set\`**: ${reason}`);
        return await message.reply(`Passerby AFK Set!`);
    }
}