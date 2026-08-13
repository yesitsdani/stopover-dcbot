const { ActionRowBuilder, UserSelectMenuBuilder } = require("discord.js")
const { createEmbedStandard } = require("../../modules")


module.exports = {
    name: 'manage',
    description: 'Manages a Passerby [Authorized Only]',
    category: 'utility',
    usage: '`stp manage`',
    cooldown: 1000 * 60 * 1,
    testing: false,
    alias: [],
    permissions: ['1506448680000159784', '1511897066262237285'],
    async execute(client, message, args) {
        const uid = message.author.id;
        const embed = createEmbedStandard()
        .setDescription(`# \`MANAGE PASSERBY\`\n\nSelect a Passerby below to manage:`)
        .setThumbnail(message.guild.iconURL());

        const actions = new ActionRowBuilder()
        .addComponents(
            new UserSelectMenuBuilder()
            .setCustomId(`manage.${uid}`)
            .setPlaceholder(`Select a Passerby`)
            .setMaxValues(1)
            .setMinValues(1)
        )

        await message.reply({ embeds: [embed], components: [actions] });
    }
}