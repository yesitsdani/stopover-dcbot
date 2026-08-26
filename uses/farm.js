
const items = require('../data/items.json');
const Farm = require('../models/Farm');
const { getRpgUser, regenHP, iconizeItemWithName, getFarm, addItemToInv } = require('../modules');

module.exports = {
    name: "potion",
    description: "Uses a potion",
    async execute(client, message, args) {
        let potions = message.content.split(" ");
        potions.shift(); potions.shift();
        const usableID = potions.shift();

        const item = items.find(itm => itm.usableID == parseInt(usableID));
        if (item.id == "farm-plotTitle") {
            const uid = message.author.id;
            const farmData = await getFarm(uid);
            if (farmData.plotSlots >= 6) {
                await addItemToInv(uid, item.id, 1);
                return message.reply(`You can only have up to \`6\` farm slots. You can sell your plot title using \`stp sell 71\``);
            }

            let plotSlots = parseInt(farmData.plotSlots) + 1;
            const newFarmData = await Farm.findOneAndUpdate(
                { uid },
                { plotSlots },
                { returnDocument: `after` }
            );

            return message.reply(`\`SUCCESS!\` You can now plant up to \`${newFarmData.plotSlots}\` crops!`);
        }
    }
}