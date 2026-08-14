const { ModalBuilder, LabelBuilder, TextInputStyle, MessageFlags, TextInputBuilder } = require("discord.js");

module.exports = {
    name: "awsn",
    async execute(client, interaction, args) {
        const action = args.shift();
        const eventID = args.shift();

        if (action == "nwaw") {
            const modal = new ModalBuilder()
                .setCustomId(`awsn.nwaw.${eventID}`)
                .setTitle(`New Award`)
                .addLabelComponents(
                    new LabelBuilder()
                        .setLabel(`Award Name:`)
                        .setTextInputComponent(
                            new TextInputBuilder()
                                .setCustomId(`awardName`)
                                .setStyle(TextInputStyle.Short)
                                .setPlaceholder(`Type your answer here`)
                        )
                )
                .addLabelComponents(
                    new LabelBuilder()
                        .setLabel(`Award Description:`)
                        .setTextInputComponent(
                            new TextInputBuilder()
                                .setCustomId(`awardDesc`)
                                .setStyle(TextInputStyle.Paragraph)
                                .setPlaceholder(`Type your answer here`)
                        )
                )

            return await interaction.showModal(modal);
        } else if (action == "noms") {
            return await interaction.reply({ content: `Wait lang beh`, flags: MessageFlags.Ephemeral });
        } else if (action == "ov") {
            return await interaction.reply({ content: `Wait lang beh`, flags: MessageFlags.Ephemeral });
        }
    }
}