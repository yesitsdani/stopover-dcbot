const shop = require('../../data/shop.json');
const items = require('../../data/items.json');
const { getUser, canAfford, iconizeMoney, subtractMoney, addItemToInv, iconizeItemWithName } = require('../../modules');

module.exports = {
    name: 'buy',
    description: 'Buys an item',
    permissions: [],
    category: 'economy',
    usage: '`stp buy <item id> [optional: quantity]`',
    cooldown: 1000 * 10,
    testing: false,
    alias: [],
    async execute(client, message, args) {
        const uid = message.author.id;
        if (!args[0]) return message.reply(`Please use \`stp buy <item id> [optional: quantity]\``);
        const shopItemID = Number(args[0]);
        if (Number.isNaN(shopItemID)) return message.reply(`Please use a valid number for the shop item ID`);

        let quantity = 1;
        if (args[1]) {
            quantity = Number(args[1]);
            if (Number.isNaN(quantity)) return message.reply(`Please use a valid number for the quantity`);
        }
        const item = items.find(itm => itm.usableID == shopItemID);
        const itemInShop = shop.find(itm => itm.itemSold == item.id);
        if (!itemInShop) return message.reply(`Are you sure that's in \`stp shop\`?`);
        const finalPrice = quantity * parseInt(itemInShop.price);

        const userData = await getUser(uid);
        if (!canAfford(userData.money, finalPrice)) return message.reply(`You need ${iconizeMoney(finalPrice)} for that. You only have ${iconizeMoney(userData.money)}`);

        await subtractMoney(uid, finalPrice);
        await addItemToInv(uid, itemInShop.itemSold, quantity);
        await message.reply(`Successfully bought: ${iconizeItemWithName(itemInShop.itemSold)} **x${quantity}** | ${itemInShop.messageWhenBought}`);
    }
}