const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { createEmbedStandard } = require("../modules");

module.exports = {
    name: "announce",
    async execute(client, interaction, args) {
        const uid = args.shift();
        const title = interaction.fields.getTextInputValue('title');
        const announcement = interaction.fields.getTextInputValue('announcement');

        const content = `# \`${title.toUpperCase()}\`\n\n${announcement}`;
        const embed = createEmbedStandard()
            .setDescription(content);

        const actions = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`announce.${uid}.write`)
                    .setLabel(`Edit`)
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId(`announce.${uid}.send.ann`)
                    .setLabel(`Send @Announcement`)
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId(`announce.${uid}.send.all`)
                    .setLabel(`Send @everyone`)
                    .setStyle(ButtonStyle.Danger)
            )

        await interaction.update({ embeds: [embed], components: [actions] });
    }
}