const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { getPouch, getPouchUpgradeCost, getPouchCapacity, iconizeMoney, createEmbedStandard, addItemToInv } = require("../modules");

module.exports = {
    name: "magical_pouch",
    description: "Opens or upgrades a Passerby's magical pouch",
    async execute(client, message, args) {
        const uid = message.author.id;
        const pouchData = await getPouch(uid);

        const nextLevelCost = getPouchUpgradeCost(pouchData.level + 1);
        const currentCapacity = getPouchCapacity(pouchData.level);
        const nextCapacity = getPouchCapacity(pouchData.level + 1);

        let content = "";
        let buttonLabel = `Open Pouch`;
        if (pouchData.level < 1) {
            content += `# \`OPEN A MAGICAL POUCH\`\n> You must pay ${iconizeMoney(nextLevelCost)}`;
            content += `\n\nYour new magical pouch will have the capacity of:\n> ${iconizeMoney(nextCapacity)}`;
        } else {
            content += `# \`UPGRADE YOUR MAGICAL POUCH\`\n> Next level costs ${iconizeMoney(nextLevelCost)}`;
            content += `\n\nYour magical pouch's capacity upon upgrade:\n> From ${iconizeMoney(currentCapacity)}\n> To ${iconizeMoney(nextCapacity)}`;
            buttonLabel = `Upgrade Pouch`;
        }

        content += `\n\n-# This operation will automatically cancel in \`15 SECONDS\``;

        const buttonRow = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId(`pouch.${uid}.upgrade`)
            .setLabel(buttonLabel)
            .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
            .setCustomId(`pouch.${uid}.cancel`)
            .setLabel(`Cancel`)
            .setStyle(ButtonStyle.Danger),
        )

        const embed = createEmbedStandard()
        .setDescription(content)
        .setThumbnail(message.author.avatarURL())

        const messageSent = await message.reply({ embeds: [embed], components: [buttonRow] });

        setTimeout(async () => {
            if (messageSent.content.length < 1) {
                await messageSent.edit({ content: `Operation cancelled`, components: [] });
                await addItemToInv(uid, 'magical_pouch', 1)
            }
        }, 15 * 1000)
    }
}