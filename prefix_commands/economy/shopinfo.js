const { getUser, iconizeMoney, iconizeItemWithName, createEmbedStandard, getItemDescriptionOnly } = require("../../modules");
const items = require('../../data/items.json');
const shop = require('../../data/shop.json');

module.exports = {
    name: 'shopinfo',
    description: 'Shows information of a specific shop item',
    permissions: [],
    category: 'economy',
    usage: '`stp shopinfo <shop item ID>`',
    cooldown: 1000 * 5,
    testing: false,
    alias: [],
    async execute(client, message, args) {
        if (!args[0]) return message.reply('Please use `stp shopinfo <shop item ID>`');
        const shopItemID = Number(args[0]);
        if (Number.isNaN(shopItemID)) return message.reply(`Please use a valid number for the shop item ID`);

        const itemInShop = shop.find(itm => itm.id == shopItemID);
        if (!itemInShop) return message.reply(`Are you sure that's in \`stp shop\`?`);

        let content = `# ${iconizeItemWithName(itemInShop.itemSold)}\n> \`SHOP ITEM ID: ${itemInShop.id}\`\n### ${getItemDescriptionOnly(itemInShop.itemSold)}\n`;

        content += `\nUse \`stp buy <ID> <optional: quantity>\` to buy`;
        const embed = createEmbedStandard()
            .setDescription(content);

        await message.reply({ embeds: [embed] });
    }
}