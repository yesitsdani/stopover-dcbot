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
        let content = `# \`CRAFTING RECIPES\`\n> Use \`stp recipe <id>\` to see specific recipe\n`;

        for (x of recipes) {
            content += `\n\`ID: ${x.craftingUsableId}\` ${iconizeItemWithName(x.id)}`;
        }

        const embed = createEmbedStandard()
        .setDescription(content);

        return message.reply({ embeds: [embed] });
    }
}