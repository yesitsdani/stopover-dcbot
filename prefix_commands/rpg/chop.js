const { checkToolTypeInTools, getRpgUser, getChopPool, randomInt, getToolFromToolbox, addItemToInv, depleteTool, iconizeItemWithName } = require("../../modules");
const equipments = require(`../../data/equipment.json`);
const Rpg = require("../../models/Rpg");

module.exports = {
    name: 'chop',
    description: 'Chops down a tree',
    permissions: [],
    category: 'rpg',
    usage: '`stp chop`',
    cooldown: 1000 * 75,
    testing: false,
    alias: [],
    async execute(client, message, args) {
        const uid = message.author.id;
        const rpgData = await getRpgUser(uid);
        const hasAxe = checkToolTypeInTools(rpgData.tools, 'axe');
        if (!hasAxe) return await message.reply(`You don't have an axe equipped...`);
        const tool = equipments.find(itm => itm.id == getToolFromToolbox(rpgData.tools, 'axe'));

        const chopPool = getChopPool(message.channel.id);
        const id = chopPool[Math.floor(Math.random() * chopPool.length)];
        const amount = randomInt(tool.drop.min, tool.drop.max);

        await addItemToInv(uid, id, amount);
        const tools = depleteTool(rpgData.tools, 'axe', 1);

        await Rpg.findOneAndUpdate(
            { uid },
            { tools }
        )

        return message.reply(`You chopped ${iconizeItemWithName(id)} x${amount}`);
    }
}