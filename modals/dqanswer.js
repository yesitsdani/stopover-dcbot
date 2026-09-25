const { ContainerBuilder, TextDisplayBuilder, SectionBuilder, ThumbnailBuilder, MessageFlags, MediaGalleryBuilder, MediaGalleryItemBuilder } = require(`discord.js`);
const { insightPoint } = require("../calculator");
const { iconizeItem, iconizeItemWithName, iconizeMoney, addMoney } = require("../modules");

module.exports = {
    name: "dqanswer",
    async execute(client, interaction, args) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const uid = args[0];
        const dqNum = args[1];
        const qid = args[2];

        const repoChannel = interaction.guild.channels.cache.find(chn => chn.id == '1532205140038254772');
        const repoMsg = await repoChannel.messages.fetch(qid);
        let question = repoMsg.content;
        if (question.includes('<@')) question = question.split(">")[1];
        if (question.includes('asks:')) question = question.split(" asks: ")[1];

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

        let content = `Very insightful! Your answer has been sent to <#${channel.id}>.`;

        let reward = 150;
        content += ` You earned ${iconizeMoney(reward)}`;

        const member = interaction.member;
        let multiplier = 1;

        if (member.roles.cache.has(`1504367974738300968`)) {
            multiplier = 100;
        } else if (member.roles.cache.has(`1504367911026819294`)) {
            multiplier = 80;
        } else if (member.roles.cache.has(`1504367715207348275`)) {
            multiplier = 60;
        } else if (member.roles.cache.has(`1504367592956235836`)) {
            multiplier = 40;
        } else if (member.roles.cache.has(`1504367456255475862`)) {
            multiplier = 20;
        }

        reward = reward * multiplier;
        if (multiplier > 1) content += ` x${multiplier} (level multiplier) = ${iconizeMoney(reward)}. `;

        await addMoney(uid, reward);

        let gemGained = await insightPoint(uid, 1);
        if (gemGained) content += `But hold on... \n# ${iconizeItem('insightGem')} \`BEHOLD, THE GEM OF INSIGHT\`\nThe universe acknowledges your outwitting of the days and have granted you a ${iconizeItemWithName('insightGem')}`;

        await channel.send({ components: [container], flags: MessageFlags.IsComponentsV2 });
        return await interaction.editReply({ content, flags: MessageFlags.Ephemeral })
    }
}