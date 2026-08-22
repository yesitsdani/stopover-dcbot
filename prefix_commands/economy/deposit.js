const { checkIfNum, getPouch, getUser, canAfford, getPouchCapacity, addToPouch, iconizeMoney, subtractMoney } = require("../../modules");

module.exports = {
    name: 'deposit',
    description: 'Deposits into a pouch',
    permissions: [],
    category: 'economy',
    usage: '`stp deposit <amount>`',
    cooldown: 1000 * 10,
    testing: false,
    alias: [],
    async execute(client, message, args) {
        if (!args[0]) return message.reply(`Please use \`stp deposit <amount>\``);
        const amount = checkIfNum(args[0]);
        if (!amount) return message.reply(`Please use a number for \`<amount>\``);

        const uid = message.author.id;
        const pouchData = await getPouch(uid);
        const userData = await getUser(uid);
        const afford = canAfford(userData.money, amount);
        if (!afford) return message.reply(`You don't have that much`);
        if (pouchData.level < 1) return message.reply(`You don't have a magical pouch yet.`);

        const pouchCapacity = getPouchCapacity(pouchData.level);
        const gems = pouchData.gems + amount
        if (gems > pouchCapacity) return message.reply(`Depositing that amount would exceed your pouch's capacity. You pouch can only handle up to ${iconizeMoney(pouchCapacity)}`);

        const newPouchData = await addToPouch(uid, amount);
        await subtractMoney(uid, amount);
        return message.reply(`\`SUCCESS!\` Your now have ${iconizeMoney(newPouchData.gems)} in your pouch`);
    }
}