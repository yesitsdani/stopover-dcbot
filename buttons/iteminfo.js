const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const items = require('../data/items.json');
const { iconizeItemWithName, createEmbedStandard } = require('../modules');

module.exports = {
    name: "hunt",
    async execute(client, interaction, args) {
        await interaction.deferUpdate();
        const page = parseInt(args[0]);

        let content = `# \`ITEMS IN THE STOPOVER\`\n> Page ${page}\n`;
        let index = (page - 1) * 10;
        for (let i = index; i < index + 10; i++) {
            let x = items[i];
            if (x) content += `\n\`ID: ${x.usableID}\` | ${iconizeItemWithName(x.id)}`;
        }

        content += `\n\n-# Use \`stp iteminfo <id>\` for each item's detail`;

        const embed = createEmbedStandard()
        .setDescription(content)

        let disablePrev = page <= 1;
        let disableNext = false;
        if (!items[(page * 10)]) disableNext = true;

        const buttonRow = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId(`iteminfo.${page - 1}`)
            .setLabel(`< Previous`)
            .setStyle(ButtonStyle.Primary)
            .setDisabled(disablePrev),
            new ButtonBuilder()
            .setCustomId(`iteminfo.${page + 1}`)
            .setLabel(`Next >`)
            .setStyle(ButtonStyle.Primary)
            .setDisabled(disableNext)
        )

        return await interaction.editReply({ embeds: [embed], components: [buttonRow] });
    }
}