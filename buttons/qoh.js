const { ContainerBuilder, TextDisplayBuilder, ActionRowBuilder, ModalBuilder, ButtonBuilder, ButtonStyle, MessageFlags, LabelBuilder, TextInputBuilder, TextInputStyle, MediaGalleryBuilder, MediaGalleryItemBuilder, SectionBuilder } = require("discord.js")

module.exports = {
    name: "qoh",
    async execute(client, interaction, args) {
        const member = interaction.member;
        const container = new ContainerBuilder()
            .setAccentColor(0xFF205F)

        if (args[0] == 'one') {
            if (!member.roles.cache.has('1532388946137579750')) return await interaction.reply({ content: `You're not tall enough for that...`, flags: MessageFlags.Ephemeral });
            container
                .addTextDisplayComponents(
                    new TextDisplayBuilder()
                        .setContent(`Using your larger height, you look at the top shelf:`)
                )
                .addMediaGalleryComponents(
                    new MediaGalleryBuilder()
                        .addItems(
                            new MediaGalleryItemBuilder()
                                .setURL(`https://imgur.com/gFIR1ZD.png`)
                        )
                )

            await interaction.reply({ components: [container], flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2 });
        } else if (args[0] == 'two') {
            if (!member.roles.cache.has('1532389143395569744')) return await interaction.reply({ content: `You're not too big for that...`, flags: MessageFlags.Ephemeral });
            container
                .addTextDisplayComponents(
                    new TextDisplayBuilder()
                        .setContent(`Using your smaller height, you look at the bottom shelf:`)
                )
                .addMediaGalleryComponents(
                    new MediaGalleryBuilder()
                        .addItems(
                            new MediaGalleryItemBuilder()
                                .setURL(`https://imgur.com/ySGRzej.png`)
                        )
                )

            await interaction.reply({ components: [container], flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2 });
        } else if (args[0] == 'three') {
            container
                .addTextDisplayComponents(
                    new TextDisplayBuilder()
                        .setContent(`# ❤️\`QUEEN OF HEARTS\`: You wish to use my looking glass, stranger? Answer me first. What is the thing that I love most?`)
                )
                .addMediaGalleryComponents(
                    new MediaGalleryBuilder()
                        .addItems(
                            new MediaGalleryItemBuilder()
                                .setURL(`https://imgur.com/ZEHotf0.png`)
                        )
                )
                .addSectionComponents(
                    new SectionBuilder()
                        .addTextDisplayComponents(
                            new TextDisplayBuilder()
                                .setContent(`Do you know the answer?`)
                        )
                        .setButtonAccessory(
                            new ButtonBuilder()
                                .setCustomId(`qoh.four`)
                                .setLabel(`Answer`)
                                .setStyle(ButtonStyle.Danger)
                        )
                )

            await interaction.reply({ components: [container], flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2 })
        } else if (args[0] == 'four') {
            const modal = new ModalBuilder()
                .setCustomId(`qoh.one`)
                .setTitle(`The Queen's Most Beloved`)
                .addLabelComponents(
                    new LabelBuilder()
                        .setLabel(`What does the Queen love most?`)
                        .setTextInputComponent(
                            new TextInputBuilder()
                                .setCustomId(`answer`)
                                .setStyle(TextInputStyle.Short)
                                .setPlaceholder(`If you can't answer me, you cannot use my looking glass.`)
                        )
                )

            await interaction.showModal(modal);
        }
    }
}