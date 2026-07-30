const { ModalBuilder, LabelBuilder, TextInputBuilder, TextInputStyle, FileUploadBuilder } = require("discord.js");
const { getIdFromMention } = require(`../modules`)

module.exports = {
    name: "dailyquery",
    async execute(client, interaction, args) {
        const dqNum = args.shift();
        let qid = args.shift();

        const repoChannel = interaction.guild.channels.cache.find(chn => chn.id == '1532205140038254772');
        const repoMsg = await repoChannel.messages.fetch(qid);
        let question = repoMsg.content;
        if (question.includes('<@')) question = question.split(">")[1];
        if (question.includes('asks:')) question = question.split(" asks: ")[1];

        const modal = new ModalBuilder()
        .setCustomId(`dqanswer.${interaction.user.id}.${dqNum}.${qid}`)
        .setTitle(`Daily Query #${dqNum}`)
        .addLabelComponents(
            new LabelBuilder()
            .setLabel(question)
            .setTextInputComponent(
                new TextInputBuilder()
                .setCustomId(`textanswer`)
                .setStyle(TextInputStyle.Paragraph)
                .setPlaceholder(`Type your answer here`)
            )
        )
        .addLabelComponents(
            new LabelBuilder()
            .setLabel(`Add an image (optional)`)
            .setDescription(`They say an image is worth a thousand words`)
            .setFileUploadComponent(
                new FileUploadBuilder()
                .setCustomId(`picture`)
                .setMinValues(0)
                .setMaxValues(1)
                .setRequired(false)
            )
        )

        await interaction.showModal(modal);

    }
}