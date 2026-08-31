const { createEmbedStandard, iconizeItemWithName, addMultipleItemsToInv } = require("../modules");
const items = require(`../data/items.json`);

module.exports = {
    name: "lb",
    description: "Uses a potion",
    async execute(client, message, args) {
        let lootbox = message.content.split(" ");
        lootbox.shift(); lootbox.shift();
        const lootboxId = lootbox.shift();

        const item = items.find(itm => itm.usableID == parseInt(lootboxId));
        const lb = item.id.split("-")[1];

        let winpool = [];
        let amountToWin = 0;

        if (lb == "ashiGem") {
            amountToWin = 1;
            winpool = [
                { id: "abundanceGem", quantity: 1 },
                { id: "destinyGem", quantity: 1 },
                { id: "devotionGem", quantity: 1 },
                { id: "creationGem", quantity: 1 },
                { id: "libertyGem", quantity: 1 },
            ]
        }

        let winnings = [];

        for (count = 1; count <= amountToWin; count++) {
            winnings.push(module.exports.selectFromWinpool(winpool))
        }

        const embed = module.exports.embedWinnings(winnings);
        await addMultipleItemsToInv(message.author.id, winnings);

        return message.reply({ embeds: [embed] });
    },

    selectFromWinpool(winpool) {
        return winpool[Math.floor(Math.random() * winpool.length)];
    },

    embedWinnings(itemArray) {
        let content = `# \`YOU GOT\`:\n`;

        for (item of itemArray) {
            content += `\n- ${iconizeItemWithName(item.id)} x${item.quantity}`;
        }

        const embed = createEmbedStandard()
            .setDescription(content);
        return embed;
    }
}