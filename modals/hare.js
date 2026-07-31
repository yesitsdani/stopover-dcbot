const { ContainerBuilder, TextDisplayBuilder, SectionBuilder, ThumbnailBuilder, MessageFlags, MediaGalleryBuilder, MediaGalleryItemBuilder } = require(`discord.js`);

module.exports = {
    name: "hare",
    async execute(client, interaction, args) {
        const member = interaction.member;
        const answer = interaction.fields.getTextInputValue('password');

        const container = new ContainerBuilder()
            .setAccentColor(0xB5EEFF)

        if (answer.toLowerCase() == "ticktock") {
            try {
                await member.roles.add([`1532389143395569744`, `1532427792824664115`]);
                await member.roles.remove(`1532388946137579750`);

                const stepchannel = interaction.guild.channels.cache.get(`1532654642947952770`);
                await stepchannel.send(`**${interaction.user.username}** has grown smaller!`);
                container
                    .addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent(`# \`YOU SHRUNK\` <@&1532389143395569744>!\n> Wow, you surely scared the hare... After drinking the drink given by the hare, you grew... smaller!\n\nWith this size, what can you do? Hmmm...`)
                    )

                return await interaction.reply({ components: [container], flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2 })
            } catch (e) {
                console.log(`Can't add role: ${e}`)
            }
        } else {
            container
                .addTextDisplayComponents(
                    new TextDisplayBuilder()
                        .setContent(`# \`WRONG PASSWORD\`\n> That ain't the code, kiddo. Try again next time.\n\nWhere can we get that code...`)
                )

            return await interaction.reply({ components: [container], flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2 })

        }
    }
}