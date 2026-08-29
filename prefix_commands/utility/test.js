const { PermissionFlagsBits, ContainerBuilder, SectionBuilder, ButtonBuilder, ButtonStyle, MediaGalleryBuilder, MediaGalleryItemBuilder, MessageFlags, TextDisplayBuilder, ThumbnailBuilder, ActionRowBuilder } = require('discord.js');
const { resetCommandCD } = require('../../modules');
const Rpg = require('../../models/Rpg');
const GuildSettings = require('../../models/GuildSettings');

module.exports = {
    name: 'test',
    description: 'Test command',
    category: 'utility',
    usage: '`stp test [command]`',
    testing: true,
    alias: [],
    permissions: ['1531987396986409011', '1506448680000159784'],
    async execute(client, message, args) {
        const guildData = await GuildSettings.findOneAndUpdate(
            { gid: message.guild.id },
            {
                announcementBuilder: {
                    title: "",
                    content: "",
                    ping: "",
                    imgURL: "",
                    signatories: []
                }
            }
        )

        console.log(guildData);

        return message.reply(`Done!`);

    }
}