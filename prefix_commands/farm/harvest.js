const { creationPoint, abundancePoint } = require("../../calculator");
const Farm = require("../../models/Farm");
const { getFarm, showPlots, iconizeItemWithName, addMultipleItemsToInv, createEmbedStandard, createLoadingScreen, randomInt } = require("../../modules");

module.exports = {
    name: 'harvest',
    description: 'Harvests crops from your farm',
    permissions: [],
    category: 'farm',
    usage: '`stp farm <item ID>`',
    cooldown: 1000 * 10,
    testing: false,
    alias: [],
    async execute(client, message, args) {
        const uid = message.author.id;
        const farmData = await getFarm(uid);
        if (farmData.plots.length < 1) return message.reply(`You don't have anything planted`);

        let addToInv= [];
        let currentPlots = farmData.plots;
        let plots = [];

        for (x of currentPlots) {
            if (Date.now() >= x.harvestTime) {
                addToInv.push({
                    id: `crop-${x.id}`, quantity: randomInt(1,4)
                })
                await creationPoint(uid, message, 2);
                await abundancePoint(uid, message);
            } else {
                plots.push({
                    id: x.id,
                    harvestTime: x.harvestTime
                });
            }
        }

        let content = `# \`YOUR HARVESTS\`:\n`;
        if (addToInv.length < 1) {
            content += `\nNothing...\n`;
            content += showPlots(farmData.plots);
        } else {
            for (x of addToInv) {
                content += `\n${iconizeItemWithName(x.id)} x${x.quantity}`;
            }
            await addMultipleItemsToInv(uid, addToInv);
            await Farm.findOneAndUpdate(
                { uid },
                { plots }
            )
        }

        const embed = createEmbedStandard()
        .setDescription(content);

        const messageSent = await message.reply({ embeds: [createLoadingScreen()] });

        setTimeout(async () => {
            await messageSent.edit({ embeds: [embed] });
        }, 2000);
    }
}