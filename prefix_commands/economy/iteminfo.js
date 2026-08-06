const { getUser, iconizeMoney, iconizeItemWithName, createEmbedStandard, getItemDescriptionOnly } = require("../../modules");
const items = require('../../data/items.json');
const shop = require('../../data/shop.json');

module.exports = {
    name: 'iteminfo',
    description: 'Shows information of a specific item',
    permissions: [],
    category: 'economy',
    usage: '`stp iteminfo <item ID>`',
    cooldown: 1000 * 5,
    testing: false,
    alias: [],
    async execute(client, message, args) {
        if (!args[0]) return message.reply('Please use `stp iteminfo <item ID>`');
        const itemID = Number(args[0]);
        if (Number.isNaN(itemID)) return message.reply(`Please use a valid number for the item ID`);

        const item = items.find(itm => itm.usableID == itemID);
        if (!item) return message.reply(`Invalid Item ID`);

        let content = `# ${iconizeItemWithName(item.id)}\n### ${getItemDescriptionOnly(item.id)}\n> Source: ${item.source}`;

        const embed = createEmbedStandard()
            .setDescription(content);

        await message.reply({ embeds: [embed] });
    }
}