const { PermissionFlagsBits, ContainerBuilder, SectionBuilder, ButtonBuilder, ButtonStyle, MediaGalleryBuilder, MediaGalleryItemBuilder, MessageFlags, TextDisplayBuilder, ThumbnailBuilder, ActionRowBuilder } = require('discord.js');

module.exports = {
    name: 'test2',
    description: 'Test command',
    category: 'utility',
    usage: '`stp help [command]`',
    testing: true,
    alias: [],
    permissions: ['1531987396986409011', '1506448680000159784'],
    async execute(client, message, args) {
        const channel = await message.guild.channels.fetch('1505071480835276900');
        let existingMessage = await channel.messages.fetch('1532267047252136028');

        const container = new ContainerBuilder()
        .setAccentColor(0xff2462)
        .addSectionComponents(
            new SectionBuilder()
            .addTextDisplayComponents(
                new TextDisplayBuilder()
                .setContent(`-# Attention all <@&1504331357386440704>\n# \`SEE YOU TOMORROW\` <a:stp_magentafire:1523665457868050522>\n> The Chief awaits...\n\n# <#1505072262468862032>\n> **31st of July, 2026 (9:30 PM)** <a:stp_bluesparkles:1523665430856728697>\n> Attendance of all Passersby is Required`)
            )
            .setThumbnailAccessory(
                new ThumbnailBuilder()
                .setURL(message.guild.iconURL())
            )
        )
        .addMediaGalleryComponents(
            new MediaGalleryBuilder()
            .addItems(
                new MediaGalleryItemBuilder()
                .setURL('https://i.pinimg.com/originals/01/80/61/018061c4115995fa9a896cfb107a512a.gif')
            )
        );

        await existingMessage.edit({ components: [container], flags: MessageFlags.IsComponentsV2 });
    }
}