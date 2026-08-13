const { checkIfNum, getInv, canCraft } = require("../../modules");
const recipes = require(`../../data/recipes.json`);

module.exports = {
    name: 'craft',
    description: 'Crafts an item',
    permissions: [],
    category: 'rpg',
    usage: '`stp craft <itemID> [optional: quantity]`',
    cooldown: 1000 * 10,
    testing: false,
    alias: [],
    async execute(client, message, args) {
        if (!args[0]) return message.reply(`Please use \`stp craft <itemID> [optional: quantity]\``);
        const itemID = checkIfNum(args[0]);
        if (itemID == null) return message.reply(`Please use a valid number for \`<itemID>\``);
        let quantity = 1;
        if (args[1]) quantity = checkIfNum(args[1]);
        if (quantity == null || quantity < 1) quantity = 1;
        const uid = message.author.id;

        const itemRecipe = recipes.find(rec => rec.craftingUsableId == itemID);
        if (!itemRecipe) return message.reply(`That item is not craftable...`);

        const invData = await getInv(uid);
        const craftable = canCraft(invData.items, itemID, quantity);

        if (craftable) {
            return message.reply(`Craftable!`);
        } else {
            return message.reply({ content: "Could not craft item", embeds: craftable.embeds });
        }
    }
}