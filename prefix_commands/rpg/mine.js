const { getMinePool, getRpgUser, checkToolTypeInTools, getToolFromToolbox, addItemToInv, depleteTool, randomInt, iconizeItemWithName } = require("../../modules");
const equipments = require(`../../data/equipment.json`);
const Rpg = require("../../models/Rpg");

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

        const minePool = getMinePool(message.channel.id);
        const id = minePool[Math.floor(Math.random() * minePool.length)];
        const amount = randomInt(tool.drop.min, tool.drop.max);

        await addItemToInv(uid, id, amount);
        const tools = depleteTool(rpgData.tools, 'pickaxe', 1);

        await Rpg.findOneAndUpdate(
            { uid },
            { tools }
        )

        return message.reply(`You chopped ${iconizeItemWithName(id)} x${amount}`);
    }
}