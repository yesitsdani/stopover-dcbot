const { getUser, iconizeMoney, iconizeItemWithName, createEmbedStandard, getItemDescriptionOnly } = require("../../modules");
const items = require('../../data/items.json');
const shop = require('../../data/shop.json');
const equipments = require('../../data/equipment.json');
const sellables = require('../../data/sellables.json');

module.exports = {
    name: 'iteminfo',
    description: 'Shows information of a specific item',
    permissions: [],
    category: 'economy',
    usage: '`stp iteminfo <item ID>`',
    cooldown: 1000 * 5,
    testing: false,
    alias: [],
    async execute(client, message, args) {
        let content = "";
        if (!args[0]) {
            content += `# \`ITEMS IN THE STOPOVER\``
            for (x of items) {
                content += `\n\`ID: ${x.usableID}\` | ${iconizeItemWithName(x.id)}`;
            }
        } else {
            const itemID = Number(args[0]);
            let itemName = args.join(" ").toLowerCase();
            let item = items.find(itm => itm.usableID == itemID);
            if (!item) item = items.find(itm => itm.name.toLowerCase().startsWith(itemName));
            if (!item) return message.reply(`Can't find that item. Are you sure you typed that right?`);

            content += `# ${iconizeItemWithName(item.id)}\n### ${getItemDescriptionOnly(item.id)}\n> Source: ${item.source}`;

            const sellable = sellables.find(itm => itm.id == item.id);
            if (sellable) content += `\n> You can sell this for ${iconizeMoney(sellable.sell_price)}`;

            const usable = await client.uses.get(item.id) || await client.uses.get(item.id.split('-')[0]);
            if (usable) content += `\n> Usage: ${usable.description}`;

            const equipment = equipments.find(eq => eq.id == item.id);
            if (equipment) {
                content += `\n> ${equipment.iteminfo}`;
                if (equipment.type != "armor") {
                    content += `\n### \`WEAPON STATS\`:\n> :dagger: \`ATK\`: ${equipment.atk}`;
                    content += `\nMelee Damage Bonus: ${equipment.dmg.melee * 100}%`;
                    content += `\nMagic Damage Bonus: ${equipment.dmg.magic * 100}%`;
                    content += `\nRange Damage Bonus: ${equipment.dmg.range * 100}%`;
                } else {
                    content += `\n### \`ARMOR STATS\`:\n> :shield: \`DEF\`: ${equipment.def}`;
                    content += `\nMelee Resistance Bonus: ${equipment.res.melee * 100}%`;
                    content += `\nMagic Resistance Bonus: ${equipment.res.magic * 100}%`;
                    content += `\nRange Resistance Bonus: ${equipment.res.range * 100}%`;
                }
                content += `\n\n+${equipment.crit.rate * 100}% Crit Rate and +${equipment.crit.dmg * 100}% Crit DMG`
            }
        }

        const embed = createEmbedStandard()
            .setDescription(content);

        await message.reply({ embeds: [embed] });
    }
}