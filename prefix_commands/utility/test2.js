const { PermissionFlagsBits, ContainerBuilder, SectionBuilder, ButtonBuilder, ButtonStyle, MediaGalleryBuilder, MediaGalleryItemBuilder, MessageFlags, TextDisplayBuilder } = require('discord.js');

module.exports = {
    name: 'test2',
    description: 'Test command',
    permissions: ['1531987396986409011', '1506448680000159784'],
    async execute(client, message, args) {
        const question = args.join(" ");
        const channel = message.guild.channels.cache.find(chn => chn.id == "1512729160290795611");
        const msg = await channel.messages.fetch("1532205832643678258")
        console.log(msg.content);
    }
}