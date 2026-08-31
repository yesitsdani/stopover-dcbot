const items = require(`../../data/items.json`);
const { takeItemFromInv, checkIfNum, getInv, getRpgUser } = require("../../modules");

module.exports = {
    name: 'use',
    description: 'Uses an item',
    permissions: [],
    category: 'rpg',
    usage: '`stp use <itemID>`',
    cooldown: 1000 * 5,
    testing: false,
    alias: [],
    async execute(client, message, args) {
        if (!args[0]) return message.reply(`Please use \`stp use <itemID>\``);
        const itemID = checkIfNum(args[0]);
        if (itemID == null) return message.reply(`Please use a valid number for \`<itemID>\``);
        const uid = message.author.id;

        const rpgData = await getRpgUser(uid);
        if (rpgData.inBattle) return message.reply(`You cannot use this because you are currently in battle right now.`);

        const item = items.find(itm => itm.usableID == itemID);
        if (!item) return message.reply(`Item not found`);
        let usable = client.uses.get(item.id);
        if (!usable && item.id.startsWith('potion')) usable = require('../../uses/potion.js');
        if (!usable && item.id.startsWith('farm')) usable = require('../../uses/farm.js');
        if (!usable && item.id.startsWith('lb')) usable = require('../../uses/lb.js');
        if (!usable) return message.reply(`This item is not usable`)

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