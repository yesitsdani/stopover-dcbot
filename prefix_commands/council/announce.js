const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { createEmbedStandard } = require("../../modules")


module.exports = {
    name: 'announce',
    description: 'Announces in the announcement chat [Authorized Only]',
    category: 'utility',
    usage: '`stp announce`',
    cooldown: 1000 * 60 * 1,
    testing: false,
    alias: ['anunsyo'],
    permissions: ['1506448680000159784', '1511897066262237285'],
    async execute(client, message, args) {
        const uid = message.author.id;
        const embed = createEmbedStandard()
        .setDescription(`# \`IPATAWAG ANG MGA KAPITBAHAY\`\n> May anunsyo ako sainyo! **CHARING**!\n\nType your announcement here!`);

        const actions = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId(`announce.${uid}.write`)
            .setLabel(`Write`)
            .setStyle(ButtonStyle.Primary)
        )

        return message.reply({ embeds: [embed], components: [actions] });
    }
}