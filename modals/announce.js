const { ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } = require("discord.js");
const { createEmbedStandard, getGuildSettings } = require("../modules");
const { createAnnouncementEmbed, updateAnnouncementBuilder, createAnnouncementButtons } = require("../prefix_commands/council/announce");

module.exports = {
    name: "announce",
    async execute(client, interaction, args) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        const title = interaction.fields.getTextInputValue('title');
        const announcement = interaction.fields.getTextInputValue('announcement');

        const gid = interaction.guild.id;
        const guildData = await getGuildSettings(gid);
        let announcementBuilder = guildData.announcementBuilder;

        announcementBuilder[`title`] = title;
        announcementBuilder[`content`] = announcement;

        const newGuildData = await updateAnnouncementBuilder(gid, announcementBuilder);
        announcementBuilder = newGuildData.announcementBuilder;

        await interaction.message.edit({ 
            embeds: [createAnnouncementEmbed(announcementBuilder)], 
            components: [createAnnouncementButtons(announcementBuilder)] 
        });

        return await interaction.editReply(`Announcement updated!`);
    }
}