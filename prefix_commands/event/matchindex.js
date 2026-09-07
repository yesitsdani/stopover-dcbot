const GuildSettings = require("../../models/GuildSettings");
const { checkIfNum, getGuildSettings } = require("../../modules");


module.exports = {
    name: 'matchindex',
    description: 'sets matchindex',
    category: 'owner',
    usage: '`stp matchindex <index>`',
    testing: true,
    alias: [],
    permissions: ['1531987396986409011', '1506448680000159784'],
    async execute(client, message, args) {
        if (!args[0]) return message.reply(`Please use \`stp matchindex <index>\``);
        const matchIndex = checkIfNum(args[0]);
        if (!matchIndex && matchIndex !== 0) return message.reply(`Please use a number for \`<index>\``);

        const guildData = await getGuildSettings(message.guild.id);
        let MatchMakerSettings = guildData.MatchMakerSettings;

        MatchMakerSettings[`matchIndex`] = matchIndex;
        await GuildSettings.findOneAndUpdate(
            { gid: message.guild.id },
            { MatchMakerSettings }
        )

        return message.reply(`Match index set to ${matchIndex} (Pair #${matchIndex + 1})`);
    }
}