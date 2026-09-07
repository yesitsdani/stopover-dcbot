const GuildSettings = require("../../models/GuildSettings");
const { checkIfNum, getGuildSettings } = require("../../modules");


module.exports = {
    name: 'likingtime',
    description: 'toggles likingtime',
    category: 'owner',
    usage: '`stp likingtime`',
    testing: true,
    alias: [],
    permissions: ['1531987396986409011', '1506448680000159784'],
    async execute(client, message, args) {
        const guildData = await getGuildSettings(message.guild.id);
        let MatchMakerSettings = guildData.MatchMakerSettings;

        if (!MatchMakerSettings.likingTime) MatchMakerSettings[`likingTime`] = true;
        else if (MatchMakerSettings.likingTime) MatchMakerSettings[`likingTime`] = false;

        await GuildSettings.findOneAndUpdate(
            { gid: message.guild.id },
            { MatchMakerSettings }
        )

        return message.reply(`Match Liking Time set to \`${MatchMakerSettings.likingTime}\``);
    }
}