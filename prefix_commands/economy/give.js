const { getUser, iconizeMoney, getIdFromMention, canAfford, addMoney, subtractMoney } = require("../../modules");

module.exports = {
    name: 'give',
    description: 'Gives gems to users',
    permissions: [],
    category: 'economy',
    usage: '`stp give <member> <amount>`',
    cooldown: 1000 * 10,
    testing: false,
    alias: [],
    async execute(client, message, args) {
        if (!args[1]) return message.reply(`Please use \`stp give <member> <amount>\``);
        let uid = args.shift();
        let amount = args.shift();
        uid = getIdFromMention(uid);
        if (uid == null) return message.reply(`Member not found`);
        if (uid == message.author.id) return message.reply(`You can't give to yourself`);
        amount = Number(amount);
        if (Number.isNaN(amount)) return message.reply(`Please use a number for \`<amount>\``);

        let userData = await getUser(message.author.id);
        if (!canAfford(userData.money, amount)) return message.reply(`You don't have that much`);

        await addMoney(uid, amount);
        await subtractMoney(message.author.id, amount);

        await message.reply(`Successfully gave ${iconizeMoney(amount)}`);
    }
}