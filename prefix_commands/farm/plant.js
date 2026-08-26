const items = require('../../data/items.json');
const crops = require('../../data/crops.json');
const { checkIfNum, getUser, hasItem, getInv, getFarm, takeItemFromInv, showPlots, createEmbedStandard, createLoadingScreen } = require('../../modules');
const Farm = require('../../models/Farm');
const { creationPoint } = require('../../calculator');

module.exports = {
    name: 'plant',
    description: 'Plants a seed down',
    permissions: [],
    category: 'farm',
    usage: '`stp plant <item ID>`',
    cooldown: 1000 * 10,
    testing: false,
    alias: [],
    async execute(client, message, args) {
        if (!args[0]) return message.reply(`Please specify the seed you want to plant`);
        let itemID = checkIfNum(args[0]);
        if (!itemID) return message.reply(`Invalid item ID`);
        let item = items.find(itm => itm.usableID == itemID);
        if (!item) return message.reply (`Item not found`);
        if (!item.id.startsWith('seed')) return message.reply(`That item is not a seed`);

        const uid = message.author.id;
        const invData = await getInv(uid);

        const haveIt = hasItem(invData.items, item.id, 1);
        if (!haveIt) return message.reply(`You don't have this seed`);
        
        const farmData = await getFarm(uid);
        if (farmData.plots.length >= farmData.plotSlots) return message.reply(`You can only plant up to ${farmData.plotSlots} crops at a time`);

        const cropID = item.id.split("-")[1];
        const crop = crops.find(itm => itm.id == cropID);
        const harvestTime = Date.now() + (1000 * 60 * parseInt(crop.harvestTime));

        let plots = farmData.plots;
        plots.push({
            id: cropID,
            harvestTime
        });

        const newFarm = await Farm.findOneAndUpdate(
            { uid },
            { plots },
            { returnDocument: 'after' }
        );

        await creationPoint(uid, message, 1);
        await takeItemFromInv(uid, item.id, 1);

        let content = `Planted in your farm:\n`;
        content += showPlots(newFarm.plots);

        const embed = createEmbedStandard()
        .setDescription(content);

        const messageSent = await message.reply({ embeds: [createLoadingScreen()] });

        setTimeout(async () => {
            await messageSent.edit({ embeds: [embed] });
        }, 2000);
    }
}