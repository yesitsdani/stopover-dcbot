const { getMinePool, getRpgUser, checkToolTypeInTools, getToolFromToolbox, addItemToInv, depleteTool, randomInt, iconizeItemWithName, addMultipleItemsToInv, createEmbedStandard } = require("../../modules");
const equipments = require(`../../data/equipment.json`);
const Rpg = require("../../models/Rpg");
const { perseverancePoint } = require("../../calculator");

module.exports = {
    name: 'mine',
    description: 'Mines in the quarry',
    permissions: [],
    category: 'rpg',
    usage: '`stp mine`',
    cooldown: 1000 * 75,
    testing: false,
    alias: [],
    async execute(client, message, args) {
        const uid = message.author.id;
        const rpgData = await getRpgUser(uid);
        const hasPickaxe = checkToolTypeInTools(rpgData.tools, 'pickaxe');
        if (!hasPickaxe) return await message.reply(`You don't have a pickaxe equipped...`);
        const tool = equipments.find(itm => itm.id == getToolFromToolbox(rpgData.tools, 'pickaxe'));

        const minePool = tool.pool;
        let rewards = [];
        let totalDeduct = 0;
        const odds = randomInt(1,100);
        let perseverance = 0;
        for (let drop of minePool) {
            if (odds > (100 - drop.chance)) {
                const quantity = randomInt(tool.drop.min, tool.drop.max);
                perseverance += quantity;
                rewards.push({ id: drop.id, quantity });
                totalDeduct += drop.deduct
            }
        }

        await addMultipleItemsToInv(uid, rewards);
        const tools = depleteTool(rpgData.tools, 'pickaxe', totalDeduct);

        const embed = module.exports.embedToolRewards(rewards, tool, totalDeduct);

        await Rpg.findOneAndUpdate(
            { uid },
            { tools }
        )

        await perseverancePoint(uid, message, perseverance);
        return message.reply({ embeds: [embed] });
    },

    embedToolRewards(rewards, tool, totalDeduct) {
        let content = `# \`YOU `;
        if (tool.id.startsWith('pickaxe')) content += `MINED`;
        if (tool.id.startsWith('axe')) content += `CHOPPED`;
        content += `\`\n> And got the following rewards:\n`;

        for (let item of rewards) {
            content += `\n${iconizeItemWithName(item.id)} **x${item.quantity}**`;
        }

        content += `\n\nYour ${iconizeItemWithName(tool.id)} lost ${totalDeduct} durability`;

        const embed = createEmbedStandard()
        .setDescription(content);

        return embed;
    }
}