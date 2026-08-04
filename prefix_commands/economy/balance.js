const { getUser, iconizeMoney } = require("../../modules");

module.exports = {
    name: 'balance',
    description: 'Shows someone\'s sparkles',
    permissions: [],
    category: 'economy',
    usage: '`stp balance [member]`',
    cooldown: 1000 * 10,
    testing: false,
    alias: ['gems', 'bal', 'currency'],
    async execute(client, message, args) {
        const uid = message.author.id;
        const userData = await getUser(uid);

        await message.reply(`You have ${iconizeMoney(userData.money)}`);
    }
}