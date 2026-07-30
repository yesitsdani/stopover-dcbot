const { ContainerBuilder, TextDisplayBuilder, ActionRowBuilder, ModalBuilder, ButtonBuilder, ButtonStyle, MessageFlags, LabelBuilder, TextInputBuilder, TextInputStyle } = require("discord.js")

module.exports = {
    name: "hare",
    async execute(client, interaction, args) {
        const member = interaction.member;
        const container = new ContainerBuilder()
            .setAccentColor(0xB5EEFF)
        if (args[0] == "one") {
            if (member.roles.cache.has(`1532388946137579750`)) return await interaction.reply({ content: `🐰\`THE HARE\`: You already got your cookie, kid.`, flags: MessageFlags.Ephemeral })
            container
                .addTextDisplayComponents(
                    new TextDisplayBuilder()
                        .setContent(`# \`A COOKIE WITH A NOTE 'EAT ME'\`\n> What should you do?`)
                )
                .addActionRowComponents(
                    new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId(`hare.three.nice`)
                                .setLabel(`Ask nicely`)
                                .setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder()
                                .setCustomId(`hare.three.grab`)
                                .setLabel(`Grab it!`)
                                .setStyle(ButtonStyle.Primary)
                        )
                )

            return await interaction.reply({ flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2, components: [container] });
        } else if (args[0] == "two") {
            if (member.roles.cache.has('1532389143395569744')) return await interaction.reply({ content: `🐰\`THE HARE\`: You already got your drink, kid.`, flags: MessageFlags.Ephemeral })
            const modal = new ModalBuilder()
                .setCustomId(`hare.one`)
                .setTitle(`For the 'Drink Me' drink`)
                .addLabelComponents(
                    new LabelBuilder()
                        .setLabel(`Do you have a code?`)
                        .setTextInputComponent(
                            new TextInputBuilder()
                                .setCustomId(`password`)
                                .setStyle(TextInputStyle.Short)
                                .setPlaceholder(`This drink ain't cheap. Tell me the code.`)
                        )
                )

            await interaction.showModal(modal);
        } else if (args[0] == "three") {
            if (args[1] == "nice") {
                try {
                    await member.roles.add(`1532388946137579750`);
                    await member.roles.remove(`1532389143395569744`);
                    container
                        .addTextDisplayComponents(
                            new TextDisplayBuilder()
                                .setContent(`# \`YOU GREW\` <@&1532388946137579750>!\n> After eating the cookie given by the hare, you grew... bigger!\n\nWith this size, what can you do? Hmmm...`)
                        )

                    await interaction.update({ components: [container], flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2 })
                } catch (e) {
                    console.log(`Unable to add role: ${e}`)
                }
            } else if (args[1] == "grab") {
                container
                    .addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent(`# \`NOT SO FAST, TOOTS\`\n> The Hare was surprisingly fast...\n\nMaybe if you asked more nicely... Hmmm...`)
                    )

                await interaction.update({ components: [container], flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2 })

            }
        }
    }
}