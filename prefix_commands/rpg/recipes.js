const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const recipes = require(`../../data/recipes.json`);
const { iconizeItemWithName, canCraft, getInv, createEmbedStandard, checkIfNum } = require("../../modules");

module.exports = {
    name: 'recipes',
    description: 'Checks an item\'s recipe',
    permissions: [],
    category: 'rpg',
    usage: '`stp recipes`',
    cooldown: 1000 * 10,
    testing: false,
    alias: [],
    async execute(client, message, args) {
        let content = `# \`CRAFTING RECIPES\`\n> Page 1\n> Use \`stp recipe <id>\` to see specific recipe\n`;

        for (let i = 0; i < 15; i++) {
            const x = recipes[i];
            content += `\n\`ID: ${x.craftingUsableId}\` ${iconizeItemWithName(x.id)}`;
        }

        const embed = createEmbedStandard()
            .setDescription(content);

        const buttonRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`recipes.0`)
                    .setLabel(`< Previous`)
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(true),
                new ButtonBuilder()
                    .setCustomId(`recipes.2`)
                    .setLabel(`Next >`)
                    .setStyle(ButtonStyle.Primary)
            )

        return message.reply({ embeds: [embed], components: [buttonRow] });
    }
}