const { ContainerBuilder, TextDisplayBuilder, SectionBuilder, ThumbnailBuilder, MessageFlags, MediaGalleryBuilder, MediaGalleryItemBuilder, ButtonStyle, ButtonBuilder } = require(`discord.js`);

module.exports = {
    name: "qoh",
    async execute(client, interaction, args) {
        const member = interaction.member;
        const answer = interaction.fields.getTextInputValue('answer');

        const container = new ContainerBuilder()
            .setAccentColor(0xFFD334)

        if (args[0] == 'one') {
            if (answer.toLowerCase() == "ash") {
                container
                    .addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent(`# \`GOOD JOB!\`\n> Next one!`)
                    )
                    .addMediaGalleryComponents(
                        new MediaGalleryBuilder()
                            .addItems(
                                new MediaGalleryItemBuilder()
                                    .setURL(`https://imgur.com/gwaR4PJ.png`)
                            )
                    )
                    .addSectionComponents(
                        new SectionBuilder()
                            .addTextDisplayComponents(
                                new TextDisplayBuilder()
                                    .setContent(`What is the word on the glass?`)
                            )
                            .setButtonAccessory(
                                new ButtonBuilder()
                                    .setCustomId(`finale.three`)
                                    .setLabel(`Answer`)
                                    .setStyle(ButtonStyle.Secondary)
                            )
                    )

                return await interaction.update({ components: [container], flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2 })
            } else {
                container
                    .addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent(`# \`THAT DOESN'T SEEM RIGHT\`\n> Try Again!`)
                    )
                    .addMediaGalleryComponents(
                        new MediaGalleryBuilder()
                            .addItems(
                                new MediaGalleryItemBuilder()
                                    .setURL(`https://imgur.com/nOmrFZf.png`)
                            )
                    )
                    .addSectionComponents(
                        new SectionBuilder()
                            .addTextDisplayComponents(
                                new TextDisplayBuilder()
                                    .setContent(`What is the word on the glass?`)
                            )
                            .setButtonAccessory(
                                new ButtonBuilder()
                                    .setCustomId(`finale.two`)
                                    .setLabel(`Answer`)
                                    .setStyle(ButtonStyle.Secondary)
                            )
                    )

                return await interaction.update({ components: [container], flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2 })
            }
        } else if (args[0] == "two") {
            if (answer.toLowerCase() == "charms") {
                container
                    .addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent(`# \`OH WAIT...\`\n> The glass is getting softer, this is it!\n\nWait... why does the symbols look weird?`)
                    )
                    .addMediaGalleryComponents(
                        new MediaGalleryBuilder()
                            .addItems(
                                new MediaGalleryItemBuilder()
                                    .setURL(`https://imgur.com/RCne1YJ.png`)
                            )
                    )
                    .addSectionComponents(
                        new SectionBuilder()
                            .addTextDisplayComponents(
                                new TextDisplayBuilder()
                                    .setContent(`What is the word on the glass?`)
                            )
                            .setButtonAccessory(
                                new ButtonBuilder()
                                    .setCustomId(`finale.four`)
                                    .setLabel(`Answer`)
                                    .setStyle(ButtonStyle.Secondary)
                            )
                    )

                return await interaction.update({ components: [container], flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2 })
            } else {
                container
                    .addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent(`# \`THAT DOESN'T SEEM RIGHT\`\n> Try Again!`)
                    )
                    .addMediaGalleryComponents(
                        new MediaGalleryBuilder()
                            .addItems(
                                new MediaGalleryItemBuilder()
                                    .setURL(`https://imgur.com/gwaR4PJ.png`)
                            )
                    )
                    .addSectionComponents(
                        new SectionBuilder()
                            .addTextDisplayComponents(
                                new TextDisplayBuilder()
                                    .setContent(`What is the word on the glass?`)
                            )
                            .setButtonAccessory(
                                new ButtonBuilder()
                                    .setCustomId(`finale.three`)
                                    .setLabel(`Answer`)
                                    .setStyle(ButtonStyle.Secondary)
                            )
                    )

                return await interaction.update({ components: [container], flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2 })
            }
        } else if (args[0] == "three") {
            if (answer.toLowerCase() == "shards") {
                container
                    .addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent(`# \`CONGRATULATIONS\`\n> You did it! You have escaped Wonderland!\n\nThank you for playing the Stopover's first Escape Room event. Nicely done!`)
                    )
                    .addMediaGalleryComponents(
                        new MediaGalleryBuilder()
                            .addItems(
                                new MediaGalleryItemBuilder()
                                    .setURL(`https://imgur.com/aFMLj6l.png`)
                            )
                    )
                    .addSectionComponents(
                        new SectionBuilder()
                            .addTextDisplayComponents(
                                new TextDisplayBuilder()
                                    .setContent(`Regain your access here:`)
                            )
                            .setButtonAccessory(
                                new ButtonBuilder()
                                    .setCustomId(`finale.five`)
                                    .setLabel(`Escape!`)
                                    .setStyle(ButtonStyle.Danger)
                            )
                    )

                return await interaction.update({ components: [container], flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2 })
            } else {
                container
                    .addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent(`# \`THAT DOESN'T SEEM RIGHT\`\n> Try Again!`)
                    )
                    .addMediaGalleryComponents(
                        new MediaGalleryBuilder()
                            .addItems(
                                new MediaGalleryItemBuilder()
                                    .setURL(`https://imgur.com/RCne1YJ.png`)
                            )
                    )
                    .addSectionComponents(
                        new SectionBuilder()
                            .addTextDisplayComponents(
                                new TextDisplayBuilder()
                                    .setContent(`What is the word on the glass?`)
                            )
                            .setButtonAccessory(
                                new ButtonBuilder()
                                    .setCustomId(`finale.four`)
                                    .setLabel(`Answer`)
                                    .setStyle(ButtonStyle.Secondary)
                            )
                    )

                return await interaction.update({ components: [container], flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2 })
            }
        }
    }
}