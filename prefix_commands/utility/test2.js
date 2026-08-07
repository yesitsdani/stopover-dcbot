const { PermissionFlagsBits, ContainerBuilder, SectionBuilder, ButtonBuilder, ButtonStyle, MediaGalleryBuilder, MediaGalleryItemBuilder, MessageFlags, TextDisplayBuilder, ThumbnailBuilder, ActionRowBuilder } = require('discord.js');
const { resetCommandCD } = require('../../modules');
const Rpg = require('../../models/Rpg');

module.exports = {
    name: 'test2',
    description: 'Test command',
    category: 'utility',
    usage: '`stp help [command]`',
    testing: true,
    alias: [],
    permissions: ['1531987396986409011', '1506448680000159784'],
    async execute(client, message, args) {
        await Rpg.findOneAndUpdate(
            { uid: message.author.id },
            { class: "" }
        )
    }
}