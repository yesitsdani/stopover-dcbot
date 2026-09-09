const { newPairing, getMatchData } = require("../../models/Match");
const { getIdFromMention, createEmbedStandard } = require("../../modules");

module.exports = {
    name: 'viewmatch',
    description: 'views match',
    category: 'owner',
    usage: '`stp viewmatch <uid>`',
    testing: true,
    alias: [],
    permissions: ['1531987396986409011', '1506448680000159784'],
    async execute(client, message, args) {
        if (!args[0]) return message.reply("Please use `stp viewmatch <uid>`");

        const uid = getIdFromMention(args[0]);
        if (uid == null) return message.reply(`Invalid user`);

        const matchData = await getMatchData(uid);
        if (!matchData) return message.reply(`No match data yet`);

        let content = `# <@${uid}>\n> Match Data\n\nPairings:`;

        if (matchData.pairs.length < 1) {
            content += `\n- No pairings made yet`
        } else {
            for (pair of matchData.pairs) {
                content += `\n- <@${pair.uid}> \`${pair.rating}\` `;
                if (!pair.finished) content += `⌛`;
                else if (pair.liked) content += `💗`;
                else content += `🤍`;
            }
        }

        if (matchData.channel) content += `\n\nChannel: <#${matchData.channel}>`;

        content += `\n\nSent Ashimails: **x${matchData.sentMail.length}**`;
        content += `\nReceived Ashimails: **x${matchData.receivedMail.length}**`;

        const embed = createEmbedStandard()
        .setDescription(content);

        return await message.reply({ embeds: [embed] });
    }
}