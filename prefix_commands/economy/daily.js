const { getUser } = require("../../modules");


module.exports = {
    name: 'daily',
    description: 'Collects daily bonus',
    permissions: [],
    category: 'economy',
    usage: '`stp daily`',
    cooldown: 1000 * 60 * 60 * 21,
    testing: false,
    alias: [],
    async execute(client, message, args) {
        const uid = message.author.id;
        const member = message.member;

        const userData = await getUser(uid);

        

    }
}