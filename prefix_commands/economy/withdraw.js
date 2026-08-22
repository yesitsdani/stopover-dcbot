const { checkIfNum, getPouch, getUser, canAfford, getPouchCapacity, addToPouch, iconizeMoney, subtractMoney, subtractFromPouch, addMoney } = require("../../modules");

module.exports = {
    name: 'withdraw',
    description: 'Withdraws into a pouch',
    permissions: [],
    category: 'economy',
    usage: '`stp withdraw <amount>`',
    cooldown: 1000 * 10,
    testing: false,
    alias: [],
    async execute(client, message, args) {
        if (!args[0]) return message.reply(`Please use \`stp withdraw <amount>\``);
        const amount = checkIfNum(args[0]);
        if (!amount) return message.reply(`Please use a number for \`<amount>\``);

        const uid = message.author.id;
        const pouchData = await getPouch(uid);
        if (pouchData.level < 1) return message.reply(`You don't have a magical pouch yet.`);

        const afford = (pouchData.gems - amount) >= 0;
        if (!afford) return message.reply(`Your pouch does not have that much`);

        const newPouchData = await subtractFromPouch(uid, amount);
        const userData = await addMoney(uid, amount);
        return message.reply(`\`SUCCESS!\` Your now have ${iconizeMoney(newPouchData.gems)} in your pouch and your new balance is ${iconizeMoney(userData.money)}`);
    }
}