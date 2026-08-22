const items = require('../data/items.json');
const { getRpgUser, regenHP, iconizeItemWithName } = require('../modules');

module.exports = {
    name: "potion",
    description: "Uses a potion",
    async execute(client, message, args) {
        let potions = message.content.split(" ");
        potions.shift(); potions.shift();
        const usableID = potions.shift();

        const item = items.find(itm => itm.usableID == parseInt(usableID));
        if (item.id == "potion-2" || item.id == "potion-3" || item.id == "potion-4") {
            let multiplier = 0.25;
            if (item.id == "potion-3") multiplier = 0.5;
            if (item.id == "potion-4") multiplier = 0.75;
            
            const uid = message.author.id;
            const rpgData = await getRpgUser(uid);
            const healAmount = parseInt(rpgData.maxHealth * multiplier);

            const newRpgData = await regenHP(uid, healAmount);
            return await message.reply(`You drank a ${iconizeItemWithName(item.id)} and have been healed. Your new health is ❤️ \`${newRpgData.health}\` / \`${newRpgData.maxHealth}\``)
        }
    }
}