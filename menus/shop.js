const { MessageFlags } = require("discord.js");
const shop = require(`../data/shop.json`);
const items = require(`../data/items.json`);
const { iconizeItemWithName, iconizeMoney, createEmbedStandard } = require("../modules");

module.exports = {
    name: "shop",
    async execute(client, interaction, args) {
        const uid = args.shift();
        if (interaction.user.id != uid) return await interaction.reply({ content: `This is not for you`, flags: MessageFlags.Ephemeral });

        const chosen = interaction.values[0];
        if (chosen == "close") return await interaction.update({ components: [] });
        await interaction.deferUpdate();

        let content = `# \`THE STOPOVER SHOP\``;

        if (chosen == "rings") {
            content += `\n> Rings and Marriage\n`;
        } else if (chosen == "equipment") {
            content += `\n> Tools and Equipment\n`;
        } else if (chosen == "perks") {
            content += `\n> Access and Perks\n`;
        }

        const shopItems = shop.filter(itm => itm.category == chosen);

        for (x of shopItems) {
            const item = items.find(itm => itm.id == x.itemSold);
            content += `\n\`ID: ${item.usableID}\` | ${iconizeItemWithName(x.itemSold)} | ${iconizeMoney(x.price)}`;
        }

        content += `\n\n-# To purchase: \`stp buy <item ID>\`\n-# For info: \`stp iteminfo <item ID>\``

        const embed = createEmbedStandard()
            .setDescription(content)
            .setThumbnail(interaction.guild.iconURL());

        return await interaction.editReply({ embeds: [embed] });
    }
}