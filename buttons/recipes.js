const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const recipes = require('../data/recipes.json');
const { iconizeItemWithName, createEmbedStandard } = require('../modules');

module.exports = {
    name: "recipes",
    async execute(client, interaction, args) {
        await interaction.deferUpdate();
        const page = parseInt(args[0]);

        let content = `# \`CRAFTING RECIPES\`\n> Page ${page}\n> Use \`stp recipe <id>\` to see specific recipe\n`;
        let index = (page - 1) * 15;
        for (let i = index; i < index + 15; i++) {
            let x = recipes[i];
            if (x) content += `\n\`ID: ${x.craftingUsableId}\` ${iconizeItemWithName(x.id)}`;
        }

        const embed = createEmbedStandard()
        .setDescription(content)

        let disablePrev = page <= 1;
        let disableNext = false;
        if (!recipes[(page * 15)]) disableNext = true;

        const buttonRow = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId(`recipes.${page - 1}`)
            .setLabel(`< Previous`)
            .setStyle(ButtonStyle.Primary)
            .setDisabled(disablePrev),
            new ButtonBuilder()
            .setCustomId(`recipes.${page + 1}`)
            .setLabel(`Next >`)
            .setStyle(ButtonStyle.Primary)
            .setDisabled(disableNext)
        )

        return await interaction.editReply({ embeds: [embed], components: [buttonRow] });
    }
}