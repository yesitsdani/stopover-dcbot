const Rpg = require('../../models/Rpg');
const GuildSettings = require('../../models/GuildSettings');
const { updateAshimail } = require('../../models/Ashimail');

module.exports = {
    name: 'test',
    description: 'Test command',
    category: 'utility',
    usage: '`stp test [command]`',
    testing: true,
    alias: [],
    permissions: ['1531987396986409011', '1506448680000159784'],
    async execute(client, message, args) {
        await GuildSettings.findOneAndUpdate(
            { gid: message.guild.id },
            {
                matchMails: [],
                MatchMakerSettings: {
                    matchIndex: 0,
                    likingTime: false,
                    finished: false
                },
            }
        )

        return message.reply(`Done!`);

    }
}