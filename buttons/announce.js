const { MessageFlags, ModalBuilder, LabelBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");

module.exports = {
    name: "announce",
    async execute(client, interaction, args) {
        const uid = args.shift();
        if (uid != interaction.user.id) return interaction.reply({ content: `This is not for you`, flags: MessageFlags.Ephemeral });

        if (args[0] == "write") {
            const modal = new ModalBuilder()
                .setCustomId(`announce.${uid}`)
                .setTitle(`Announcement`)
                .addLabelComponents(
                    new LabelBuilder()
                        .setLabel(`Title`)
                        .setTextInputComponent(
                            new TextInputBuilder()
                                .setCustomId(`title`)
                                .setStyle(TextInputStyle.Short)
                                .setPlaceholder(`Add Announcement Title`)
                                .setRequired(true)
                        )
                )
                .addLabelComponents(
                    new LabelBuilder()
                        .setLabel(`Announcement`)
                        .setTextInputComponent(
                            new TextInputBuilder()
                                .setCustomId(`announcement`)
                                .setStyle(TextInputStyle.Paragraph)
                                .setPlaceholder(`Add Announcement Message`)
                                .setRequired(true)
                        )
                )

            return await interaction.showModal(modal);
        } else if (args[0] == "send") {
            await interaction.deferUpdate();
            let ping = "<@&1506156891917647952>";
            if (args[1] == "all") ping = "<@&1504331357386440704>";

            const announceChannel = await interaction.guild.channels.fetch(`1504336025533550717`);
            const embed = interaction.message.embeds[0];

            await announceChannel.send({ embeds: [embed], content: ping });
            return await interaction.editReply({ content: `Done! Posted to <#1504336025533550717>`, components: [] });
        }
    }
}