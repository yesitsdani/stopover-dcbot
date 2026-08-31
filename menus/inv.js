const { MessageFlags } = require("discord.js");
const shop = require(`../data/shop.json`);
const items = require(`../data/items.json`);
const { iconizeItemWithName, iconizeMoney, createEmbedStandard, getInv } = require("../modules");
const { inventoryGui } = require("../prefix_commands/economy/inventory");

module.exports = {
    name: "inv",
    async execute(client, interaction, args) {
        const uid = args.shift();
        if (interaction.user.id != uid) return await interaction.reply({ content: `This is not for you`, flags: MessageFlags.Ephemeral });

        const chosen = interaction.values[0];
        if (chosen == "close") return await interaction.update({ components: [] });
        await interaction.deferUpdate();

        const invData = await getInv(uid);

        return await interaction.editReply(inventoryGui(uid, invData, chosen));
    }
}