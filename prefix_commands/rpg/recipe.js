const recipes = require(`../../data/recipes.json`);
const { iconizeItemWithName, canCraft, getInv, createEmbedStandard, checkIfNum } = require("../../modules");
const items = require(`../../data/items.json`);

module.exports = {
    name: 'recipe',
    description: 'Checks an item\'s recipe',
    permissions: [],
    category: 'rpg',
    usage: '`stp recipe <itemID>`',
    cooldown: 1000 * 10,
    testing: false,
    alias: [],
    async execute(client, message, args) {
        if (!args[0]) return message.reply(`Please use \`stp recipe <itemID or item name>\``);
        const itemID = checkIfNum(args[0]);
        let item = items.find(itm => itm.usableID == itemID);
        if (!item) item = items.find(itm => itm.name.toLowerCase().startsWith(args.join(" ").toLowerCase()));
        if (!item) return message.reply(`Invalid Item`);

        const itemRecipe = recipes.find(rec => rec.craftingUsableId == item.usableID);
        if (!itemRecipe) return message.reply(`That is not craftable...`);
        const uid = message.author.id;

        let content = `# ${iconizeItemWithName(itemRecipe.id)}\n-# \`Item ID\`: ${item.usableID}\n`;
        for (x of itemRecipe.recipe) {
            content += `\n**x${x.quantity}** | ${iconizeItemWithName(x.id)}`;
        }

        const invData = await getInv(uid);
        const itemCraftable = canCraft(invData.items, itemRecipe.craftingUsableId, 1);

        if (itemCraftable.canCraft) content += `\n\nYou have enough materials to craft this item!`;
        else content += `\n\nYou don't have enough materials to craft this item`;
        content += `\n-# To craft this, use \`stp craft ${itemRecipe.craftingUsableId}\``;
        
        const embed = createEmbedStandard()
        .setDescription(content);

        return message.reply({ embeds: [embed] });
    }
}