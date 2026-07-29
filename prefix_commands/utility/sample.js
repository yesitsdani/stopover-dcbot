const { PermissionFlagsBits, ContainerBuilder, SectionBuilder, ButtonBuilder, ButtonStyle, MediaGalleryBuilder, MediaGalleryItemBuilder, MessageFlags, TextDisplayBuilder } = require('discord.js');

module.exports = {
    name: 'sample',
    description: 'Test command',
    permissions: ['1531987396986409011', '1506448680000159784'],
    async execute(client, message, args) {
        console.time("reply");

        await message.reply("Hello!");

        console.timeEnd("reply");
    }
}