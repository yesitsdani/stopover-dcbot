const { getIdFromMention } = require(`../../modules`)

module.exports = {
    name: 'test',
    description: 'Test command',
    category: 'utility',
    usage: '`stp help [command]`',
    testing: true,
    alias: [],
    permissions: ['1531987396986409011', '1506448680000159784'],
    async execute(client, message, args) {
        for (x of message.member.roles.cache) {
            console.log(x[1]);
        }
    }
}