const { getUser, iconizeMoney, getInv, createEmbedStandard, iconizeItemWithName } = require("../../modules");
const items = require('../../data/items.json');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");

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

        const messageSent = await message.reply(module.exports.inventoryGui(uid, invData, "general"));
        setTimeout(async () => {
            await messageSent.edit({ components: [] });
        }, 1000 * 15);
    },

    inventoryGui(uid, invData, category) {
        let content = `# <@${uid}>'s Inventory\n> \`${category.toUpperCase()} ITEMS\`\n`;

        if (!invData.items || invData.items.length < 1) {
            content += `\nYou have no items...`
        } else {
            for (x of invData.items) {
                let item = items.find(itm => itm.id == x.id);
                if (item && item.category == category) content += `\n\`ID: ${item.usableID}\` | ${iconizeItemWithName(x.id)} x${x.quantity}`;
            }
        }

        content += `\n\n-# You can use \`stp iteminfo <ID or name>\` to learn more about an item`;
        content += `\n-# Select category in the dropdown menu below (disappears in 15 seconds)`;

        const embed = createEmbedStandard()
            .setDescription(content);

        const menuRow = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId(`inv.${uid}`)
                    .setPlaceholder(`Select Inventory Category`)
                    .setMaxValues(1)
                    .addOptions(
                        new StringSelectMenuOptionBuilder()
                            .setValue(`general`)
                            .setDescription(`Ordinary items in the Stopover`)
                            .setLabel(`General Items`),
                        new StringSelectMenuOptionBuilder()
                            .setValue(`special`)
                            .setDescription(`Extraordinary items in the Stopover`)
                            .setLabel(`Special Items`),
                        new StringSelectMenuOptionBuilder()
                            .setValue(`equipment`)
                            .setDescription(`Usable items in the Stopover`)
                            .setLabel(`Tools and Equipment`),
                        new StringSelectMenuOptionBuilder()
                            .setValue(`profile`)
                            .setDescription(`Items that can change your In-Server and Passerby Profile`)
                            .setLabel(`Profile and In-Server Items`),
                        new StringSelectMenuOptionBuilder()
                            .setValue(`close`)
                            .setDescription(`Removes the selection menu from this message`)
                            .setLabel(`Close Menu`)
                    )
            )

        return { embeds: [embed], components: [menuRow] };
    }
}