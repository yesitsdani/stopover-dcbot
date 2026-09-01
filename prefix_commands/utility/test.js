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
                sessionUntil: 0
            }
        )

        return message.reply(`Done!`);

    }
}