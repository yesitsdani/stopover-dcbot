const { ContainerBuilder, TextDisplayBuilder, ActionRowBuilder, ModalBuilder, ButtonBuilder, ButtonStyle, MessageFlags, LabelBuilder, TextInputBuilder, TextInputStyle, MediaGalleryBuilder, MediaGalleryItemBuilder } = require("discord.js")

module.exports = {
    name: "cheshire",
    async execute(client, interaction, args) {
        const member = interaction.member;
        const container = new ContainerBuilder()
            .setAccentColor(0xCD8CFF)

        let textContent = ``;
        let galleryURL = ``;
        if (!member.roles.cache.has(`1532427792824664115`)) {
            text = `# \`CHESHIRE CAT\`\n> The cat that tricks your eyes and speaks in a language one cannot understand. I think you need a **Vinegar key**?\n\nCheshire Cat says:\n\`\`\`K aupkrv bqui jwtj, vvrrqiei. Qqt r oqt fi refsne xrv tyh eolucgv wq stugad lp tyhue nrqdj. Qqt kkg hrwvei, qqt kkg exj dopv, pok hxee wjak kcrv zjo bhgpj detzqi lzng hv'v voljj! Tyh oodhpt kkct ydte jwgpj lp hvug, I axut jda TZFMTFFM aeg je uuqpj hxeibvhzqi hv kcs, ron ffu oy kdmiej. Aol fcn lvg tydv, bp wje nda.\`\`\``;
            galleryURL = `https://imgur.com/XIRCNQl.png`;
        } else if (!member.roles.cache.has(`1532427854401503544`)) {
            text = `# \`CHESHIRE CAT\`\n> The cat that tricks your eyes and speaks in a language one cannot understand. I think you need a **Vinegar key**?\n\nCheshire Cat says:\n\`\`\`Nuur maspz, C klq. Mwlym dpwy qvg aga fbw omlw pz u xyqhrf, toz? Dti vpp sgb syl pz njvgvdl iclo fbaz fcel? Iuaa, xyl tq amlem... Loq Kmlqh gm Tysyfm? Zh! U efli cl. Dtul'z fbsa? Kim dmhl aa efvi qzhf mzl xinle nzl yika? Fbsa'e yszk! Qzf pif'a kim ads dvaeaus zgy fbw uangyuimz plsnah gm Iifkqldhzx lomn guxs tlzxk aa nzl icwspyj vr nzl Hijwmf Kdalv? Fao'jl uh s kuaaamf kjdywu. Fck ztimsp vw lmmq mal qh! \`\`\``;
            galleryURL = `https://imgur.com/ZZS7Ch5.png`;
        } else return await interaction.reply({ content: `😺\`CHESHIRE CAT\`: My work here is done... go away`, flags: MessageFlags.Ephemeral });

        container
            .addTextDisplayComponents(
                new TextDisplayBuilder()
                    .setContent(text)
            )
            .addMediaGalleryComponents(
                new MediaGalleryBuilder()
                    .addItems(
                        new MediaGalleryItemBuilder()
                            .setURL(galleryURL)
                    )
            )

        const stepchannel = interaction.guild.channels.cache.get(`1532654642947952770`);
        await stepchannel.send(`**${interaction.user.username}** screamed at the magical forest!`);

        await interaction.reply({ components: [container], flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2 })
    }
}