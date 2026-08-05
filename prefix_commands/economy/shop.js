const { getUser, iconizeMoney, iconizeItemWithName, createEmbedStandard } = require("../../modules");
const items = require('../../data/items.json');
const shop = require('../../data/shop.json');

module.exports = {
    name: 'shop',
    description: 'Shows the shop',
    permissions: [],
    category: 'economy',
    usage: '`stp shop`',
    cooldown: 1000 * 5,
    testing: false,
    alias: [],
    async execute(client, message, args) {
        let content = `# \`THE STOPOVER SHOP\`\n> Buy your Passerby supplies here!\n`;

        for (x of shop) {
            content += `\n\`ID: ${x.id}\` | ${iconizeItemWithName(x.itemSold)} | ${iconizeMoney(x.price)}`
        }

        content += `\n\n Use \`stp buy <ID> <optional: quantity>\` to buy`;
        content += `\nUse \`stp shopinfo <ID>\` for more information on a specific item`;
        const embed = createEmbedStandard()
        .setDescription(content);

        await message.reply({ embeds: [embed]});
    }
}