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
        await updateAshimail(
            message.author.id,
            {
                mailBuilder: {
                    uid: "",
                    anon: false,
                    title: "",
                    content: "",
                    unread: false,
                    dateSent: 0,
                    signed: false
                }
            }
        )

        await GuildSettings.findOneAndUpdate(
            { uid: message.guild.id },
            { afkUsers: [], mailedUsers: [] }
        )

        return message.reply(`Done!`);

    }
}