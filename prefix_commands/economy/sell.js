const { checkIfNum, hasItem, getInv, takeItemFromInv, addMoney, iconizeItemWithName, iconizeMoney } = require("../../modules");
const sellables = require('../../data/sellables.json');

module.exports = {
    name: 'sell',
    description: 'Sells an item',
    permissions: [],
    category: 'economy',
    usage: '`stp sell <itemID> [optional: quantity]`',
    cooldown: 1000 * 10,
    testing: false,
    alias: [],
    async execute(client, message, args) {
        if (!args[0]) return message.reply(`Please use \`stp sell <itemID> [optional: quantity]\``);
        const itemID = checkIfNum(args[0]);
        if (itemID == null) return message.reply(`Please use a valid number for \`<itemID>\``);
        let quantity = 1;
        if (args[1]) quantity = checkIfNum(args[1]);
        if (quantity == null || quantity < 1) quantity = 1;
        const uid = message.author.id;

        const sellable = sellables.find(itm => itm.useableID == itemID);
        if (!sellable) return message.reply(`You can't sell this item`);

        const invData = await getInv(uid);
        const itemInInv = invData.items.find(itm => itm.id == sellable.id);
        if (itemInInv && args[1] == "all") quantity = parseInt(itemInInv.quantity);
        const holdsItem = hasItem(invData.items, sellable.id, quantity);
        if (!holdsItem) return message.reply(`You don't have that item or you don't have that much of it`);

        await takeItemFromInv(uid, sellable.id, quantity);
        await addMoney(uid, quantity * sellable.sell_price);

        return message.reply(`Sold ${iconizeItemWithName(sellable.id)} x${quantity} for ${iconizeMoney(quantity * sellable.sell_price)}`);
    }
}