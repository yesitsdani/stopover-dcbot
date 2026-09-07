const { setMatchMails } = require("../../alerts");
const { getGuildSettings } = require("../../modules");


module.exports = {
    name: 'setmatchmail',
    description: 'sets matchmail',
    category: 'owner',
    usage: '`stp setmatchmail`',
    testing: true,
    alias: [],
    permissions: ['1531987396986409011', '1506448680000159784'],
    async execute(client, message, args) {
        const guildData = await getGuildSettings(message.guild.id);

        setMatchMails(guildData.matchMails);

        return message.reply(`Set all existing match mails in alerts`);
    }
}