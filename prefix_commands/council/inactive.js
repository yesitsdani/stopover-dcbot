const { getIdFromMention } = require("../../modules");


module.exports = {
    name: 'inactive',
    description: 'Marks Passersby as Inactive [Authorized Only]',
    category: 'council',
    usage: '`stp inactive <Passerby 1> [Passerby 2]... [Passerby N]`',
    cooldown: 1000 * 5,
    testing: false,
    bypassDeath: true,
    alias: [],
    permissions: ['1506448680000159784', '1511897066262237285'],
    async execute(client, message, args) {
        if (!args[0]) return message.reply(`Who are you tagging?`);

        await message.reply(`Please wait (this can take a while...)`);

        let count = 0;
        for (const mention of args) {
            const uid = getIdFromMention(mention);
            if (uid == null) continue;
            let member; 
            try {
                member = await message.guild.members.fetch(uid);
            } catch (e) { continue; }
            if (member.user.bot) continue;
            await member.roles.add(`1507597348363309168`);
            count++;
        }

        let content = `Marked ${count} member`;
        if (count > 1) content += `s`;
        content += ` inactive (added the <@&1507597348363309168> role to them)`;

        return await message.reply(content);
    }
}