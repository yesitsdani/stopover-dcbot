const { getUser, iconizeMoney, getInv, createEmbedStandard, iconizeItemWithName } = require("../../modules");
const items = require('../../data/items.json');

module.exports = {
    name: 'inventory',
    description: 'Shows inventory',
    permissions: [],
    category: 'economy',
    usage: '`stp inventory`',
    cooldown: 1000 * 10,
    testing: false,
    alias: ['inv', 'bag', 'items'],
    async execute(client, message, args) {
        const uid = message.author.id;
        const invData = await getInv(uid);
        
        let content = `# <@${uid}>'s Inventory`;

        if (!invData.items || invData.items.length < 1) {
            content += `\nYou have no items...`
        } else {
            for (x of invData.items) {
                let item = items.find(itm => itm.id == x.id);
                if (item) content += `\n\`ID: ${item.usableID}\` | ${iconizeItemWithName(x.id)} x${x.quantity}`;
            }
        }

        content += `\n\nYou can use \`stp iteminfo <ID> to learn more about an item\``;

        const embed = createEmbedStandard()
        .setDescription(content);

        await message.reply({ embeds: [embed] });
    }
}