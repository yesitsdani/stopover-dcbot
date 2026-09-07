const { getMatchData, deleteMatchData } = require("../../models/Match");
const { getIdFromMention, createEmbedStandard } = require("../../modules");

module.exports = {
    name: 'deletematch',
    description: 'deletes match',
    category: 'owner',
    usage: '`stp deletematch <uid>`',
    testing: true,
    alias: [],
    permissions: ['1531987396986409011', '1506448680000159784'],
    async execute(client, message, args) {
        if (!args[0]) return message.reply("Please use `stp viewmatch <uid>`");

        const uid = getIdFromMention(args[0]);
        if (uid == null) return message.reply(`Invalid user`);

        const matchData = await getMatchData(uid);
        if (!matchData) return message.reply(`No match data yet`);

        await deleteMatchData(uid);

        return await message.reply(`Match data deleted!`);
    }
}