const { getUser, iconizeMoney, iconizeItemWithName, createEmbedStandard, iconizeItem, createLoadingScreen } = require("../../modules");
const items = require('../../data/items.json');
const shop = require('../../data/shop.json');
const { StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } = require("discord.js");

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
        const uid = message.author.id;
        let content = `# \`THE STOPOVER SHOP\`\n> Greetings, Passerby! Find everything you need here in The Stopover Shop.`;

        content += `\n\n### Select Category:`
        content += `\n${iconizeItem('ringE')} \`RINGS AND MARRIAGE\``;
        content += `\n:dagger: \`TOOLS AND EQUIPMENT\``;
        content += `\n:credit_card: \`ACCESS AND PERKS\``;
        content += `\n:seedling: \`SEEDS FOR FARMING\``;
        content += `\n:jar: \`ITEMS AND MISCELLANEOUS\``;
        content += `\n\nThe Dropdown Menu below will disappear in 20 seconds`;
        const embed = createEmbedStandard()
            .setDescription(content);

        const menu = new StringSelectMenuBuilder()
            .setCustomId(`shop.${uid}`)
            .setPlaceholder(`Select Shop Category`)
            .setMaxValues(1)
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setValue(`rings`)
                    .setDescription(`Rings and other Marriage Things`)
                    .setLabel(`Rings and Marriage`),
                new StringSelectMenuOptionBuilder()
                    .setValue(`equipment`)
                    .setDescription(`Equippable items used in things`)
                    .setLabel(`Tools and Equipment`),
                new StringSelectMenuOptionBuilder()
                    .setValue(`perks`)
                    .setDescription(`In-Server Accesses and STP Bot Perks`)
                    .setLabel(`Access and Perks`),
                new StringSelectMenuOptionBuilder()
                    .setValue(`farm`)
                    .setDescription(`Used to grow new life`)
                    .setLabel(`Seeds for Farming`),
                new StringSelectMenuOptionBuilder()
                    .setValue(`misc`)
                    .setDescription(`Crafting materials and other items`)
                    .setLabel(`Items and Miscellaneous`),
                new StringSelectMenuOptionBuilder()
                    .setValue(`close`)
                    .setDescription(`Removes the selection menu from this message`)
                    .setLabel(`Close Menu`)
            )

        const actions = new ActionRowBuilder()
            .addComponents(menu)

        const messageSent = await message.reply({ embeds: [createLoadingScreen()] });

        setTimeout(async () => {
            await messageSent.edit({ embeds: [embed], components: [actions] });
            setTimeout(async () => {
                await messageSent.edit({ components: [] });
            }, 20000);
        }, 2000);
    }
}