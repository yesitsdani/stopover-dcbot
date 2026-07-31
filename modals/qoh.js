const { ContainerBuilder, TextDisplayBuilder, SectionBuilder, ThumbnailBuilder, MessageFlags, MediaGalleryBuilder, MediaGalleryItemBuilder } = require(`discord.js`);

module.exports = {
    name: "qoh",
    async execute(client, interaction, args) {
        const member = interaction.member;
        const answer = interaction.fields.getTextInputValue('answer');

        const container = new ContainerBuilder()
            .setAccentColor(0xFF205F)

        if (answer.toLowerCase() == "jabberwocky") {
            try {
                container
                    .addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent(`# \`VERY WELL, TAKE\` <@&1532389497394696393>!\n> My looking glass needs cleaning anyway... Go ahead and shine it up.\n\n## Check your channel list for the Looking Glass`)
                    )

                const stepchannel = interaction.guild.channels.cache.get(`1532654642947952770`);
                await stepchannel.send(`**${interaction.user.username}** has been given permission by the Queen of Hearts to use the Looking Glass!`);
                await interaction.reply({ components: [container], flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2 })

                setTimeout(async () => {
                    await member.roles.add(`1532389497394696393`);
                    await member.roles.remove(['1532427792824664115', '1532427854401503544', '1532389393162305546', '1532388946137579750', '1532389143395569744', '1532389210827391066']);
                }, 3000);
            } catch (e) {
                console.log(`Can't add role: ${e}`)
            }
        } else {
            container
                .addTextDisplayComponents(
                    new TextDisplayBuilder()
                        .setContent(`# \`YOU'RE MISTAKEN\`\n> Answer better next time or else it'll be **off with your head!**\n\nWhat does the queen love most...`)
                )

            return await interaction.reply({ components: [container], flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2 })

        }
    }
}