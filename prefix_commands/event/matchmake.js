const { newPairing } = require("../../models/Match");
const { getIdFromMention } = require("../../modules");

module.exports = {
    name: 'matchmake',
    description: 'create match',
    category: 'owner',
    usage: '`stp matchmake <uid1> <uid2> <rating>`',
    testing: true,
    alias: [],
    permissions: ['1531987396986409011', '1506448680000159784'],
    async execute(client, message, args) {
        if (!args[2]) return message.reply("Please use `stp matchmake <uid1> <uid2> <rating>`");

        const uid1 = getIdFromMention(args[0]);
        const uid2 = getIdFromMention(args[1]);
        if (uid1 == null || uid2 == null) return message.reply(`One or both are invalid users`);

        const member1 = await message.guild.members.fetch(uid1);
        const member2 = await message.guild.members.fetch(uid2);
        if (!member1 || !member2) return message.reply(`Invalid member/s`);
        if (member1.user.bot || member2.user.bot) return message.reply(`One or both users are bots`);

        const rating = args[2];

        await newPairing(uid1, uid2, rating);

        return await message.reply(`Match made!`);
    }
}