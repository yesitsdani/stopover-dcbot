const { ContainerBuilder, TextDisplayBuilder, SectionBuilder, ThumbnailBuilder, MessageFlags, MediaGalleryBuilder, MediaGalleryItemBuilder } = require(`discord.js`);

module.exports = {
    name: "dqanswer",
    async execute(client, interaction, args) {
        const uid = args[0];
        const dqNum = args[1];
        const question = args[2];

        const channel = interaction.guild.channels.cache.find(chn => chn.id == '1504505337179406346')

        const answer = interaction.fields.getTextInputValue('textanswer');
        const picture = interaction.fields.getUploadedFiles('picture');

        const container = new ContainerBuilder()
            .setAccentColor(0xF2B0FF)
            .addSectionComponents(
                new SectionBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent(`-# <@${uid}> answers the question: ${question}\n## ${answer}`)
                    )
                    .setThumbnailAccessory(
                        new ThumbnailBuilder()
                            .setURL(interaction.user.avatarURL())
                    )
            )

        if (picture) {
            const gallery = new MediaGalleryBuilder();
            picture.forEach(attachment => {
                gallery.addItems(
                    new MediaGalleryItemBuilder()
                        .setURL(attachment.url)
                );
            });
            container.addMediaGalleryComponents(gallery);
        }

        container.addTextDisplayComponents(
            new TextDisplayBuilder()
                .setContent(`-# ${interaction.guild.name} <a:stp_pinksparkles:1528714739004473456>`)
        )

        await channel.send({ components: [container], flags: MessageFlags.IsComponentsV2 });
        return await interaction.reply({ content: `Your answer has been sent to <#${channel.id}>`, flags: MessageFlags.Ephemeral })
    }
}