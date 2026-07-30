const { ContainerBuilder, TextDisplayBuilder, ActionRowBuilder, ModalBuilder, ButtonBuilder, ButtonStyle, MessageFlags, LabelBuilder, TextInputBuilder, TextInputStyle, MediaGalleryBuilder, MediaGalleryItemBuilder, SectionBuilder } = require("discord.js")

module.exports = {
    name: "finale",
    async execute(client, interaction, args) {
        const member = interaction.member;
        const container = new ContainerBuilder()
            .setAccentColor(0xFFD334)

        if (args[0] == 'one') {
            if (!member.roles.cache.has(`1531529841717809232`)) {
                container
                    .addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent(`# \`THANK YOU FOR PLAYING!\` <a:stp_heartspin:1523664759432548352>\n> You have already finished **Escape Room 1: Stopover in Wonderland**\n\nCongratulations, Passerby! You did it! I hope you enjoyed your little trip down Wonderland. Where could we be off to next time? 👀`)
                    )
                    .addMediaGalleryComponents(
                        new MediaGalleryBuilder()
                            .addItems(
                                new MediaGalleryItemBuilder()
                                    .setURL(`https://imgur.com/tXBGYDB.png`)
                            )
                    )
                return await interaction.reply({ components: [container], flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2 })
            }
            container
                .addTextDisplayComponents(
                    new TextDisplayBuilder()
                        .setContent(`# \`WHAT IS THIS WORD?\``)
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

            return await interaction.reply({ components: [container], flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2 })
        } else if (args[0] == 'two') {
            const modal = new ModalBuilder()
                .setCustomId(`finale.one`)
                .setTitle(`What's the Word?`)
                .addLabelComponents(
                    new LabelBuilder()
                        .setLabel(`What's the word on the glass?`)
                        .setTextInputComponent(
                            new TextInputBuilder()
                                .setCustomId(`answer`)
                                .setStyle(TextInputStyle.Short)
                                .setPlaceholder(`Type Answer Here`)
                        )
                )

            await interaction.showModal(modal);
        } else if (args[0] == 'three') {
            const modal = new ModalBuilder()
                .setCustomId(`finale.two`)
                .setTitle(`What's the Word?`)
                .addLabelComponents(
                    new LabelBuilder()
                        .setLabel(`What's the word on the glass?`)
                        .setTextInputComponent(
                            new TextInputBuilder()
                                .setCustomId(`answer`)
                                .setStyle(TextInputStyle.Short)
                                .setPlaceholder(`Type Answer Here`)
                        )
                )

            await interaction.showModal(modal);
        } else if (args[0] == 'four') {
            const modal = new ModalBuilder()
                .setCustomId(`finale.three`)
                .setTitle(`What's the Word?`)
                .addLabelComponents(
                    new LabelBuilder()
                        .setLabel(`What's the word on the glass?`)
                        .setTextInputComponent(
                            new TextInputBuilder()
                                .setCustomId(`answer`)
                                .setStyle(TextInputStyle.Short)
                                .setPlaceholder(`Type Answer Here`)
                        )
                )

            await interaction.showModal(modal);
        } else if (args[0] == 'five') {
            try {
                await member.roles.remove(`1531529841717809232`);
            } catch (e) {
                console.log(`Cannot remove role: ${e}`)
            }
            container
                .addTextDisplayComponents(
                    new TextDisplayBuilder()
                        .setContent(`# \`THANK YOU FOR PLAYING!\` <a:stp_heartspin:1523664759432548352>\n> You have finished **Escape Room 1: Stopover in Wonderland**\n> Your Server Access has been Restored. You shall have access to The Looking Glass channel until the end of this event season.\n\nCongratulations, Passerby! You did it! I hope you enjoyed your little trip down Wonderland. Where could we be off to next time? 👀`)
                )
                .addMediaGalleryComponents(
                    new MediaGalleryBuilder()
                        .addItems(
                            new MediaGalleryItemBuilder()
                                .setURL(`https://imgur.com/tXBGYDB.png`)
                        )
                )
            const loggingChannel = interaction.guild.channels.cache.get(`1504325792233164821`)
            await loggingChannel.send(`<@${interaction.user.id}> has finished The Escape Room 1: Stopover in Wonderland`)
            await interaction.update({ components: [container], flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2});
        }
    }
}