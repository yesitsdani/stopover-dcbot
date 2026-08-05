const { getUser, iconizeMoney, getIdFromMention, canAfford, addMoney, subtractMoney, setMoney } = require("../../modules");

module.exports = {
    name: 'setmoney',
    description: 'Sets a user\'s money',
    permissions: ['1506448680000159784'],
    category: 'economy',
    usage: '`stp setmoney <member> <amount>`',
    cooldown: 1000 * 10,
    testing: false,
    alias: ['setgem'],
    async execute(client, message, args) {
        if (!args[1]) return message.reply(`Please use \`stp give <member> <amount>\``);
        let uid = args.shift();
        let amount = args.shift();
        uid = getIdFromMention(uid);
        if (uid == null) uid = message.author.id;
        amount = Number(amount);
        if (Number.isNaN(amount)) return message.reply(`Please use a number for \`<amount>\``);

        await setMoney(uid, amount);

        await message.reply(`Successfully set ${iconizeMoney(amount)}`);
    }
}