const items = require(`../../data/items.json`);
const { takeItemFromInv, checkIfNum, getInv } = require("../../modules");

module.exports = {
    name: 'use',
    description: 'Uses an item',
    permissions: [],
    category: 'rpg',
    usage: '`stp use <itemID>`',
    cooldown: 1000 * 10,
    testing: false,
    alias: [],
    async execute(client, message, args) {
        if (!args[0]) return message.reply(`Please use \`stp use <itemID>\``);
        const itemID = checkIfNum(args[0]);
        if (itemID == null) return message.reply(`Please use a valid number for \`<itemID>\``);
        const uid = message.author.id;

        const item = items.find(itm => itm.usableID == itemID);
        if (!item) return message.reply(`Item not found`);
        const usable = client.uses.get(item.id);
        if (!usable) return message.reply(`This item is not usable`);

        const invData = await getInv(uid);
        const itemInInv = invData.items.find(itm => itm.id == item.id);
        if (!itemInInv || itemInInv.quantity < 1) return message.reply(`You don't have this item...`);

        try {
            await takeItemFromInv(uid, item.id, 1);
            await usable.execute(client, message, args);
        } catch (e) {
            console.log(e);
            return await message.reply(`Woops! Ashi made an oopsie! Kindly mention him na lang, thanks!`);
        }
    }
}